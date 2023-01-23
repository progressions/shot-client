import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Switch, FormControlLabel, Stack, Snackbar, Alert, Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'

import ButtonBar from "../components/ButtonBar"
import AddFight from '../components/fights/AddFight'
import FightDetail from '../components/fights/FightDetail'
import Layout from '../components/Layout'
import Client from '../components/Client'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { useMemo, useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

import { useToast } from "../contexts/ToastContext"
import { useClient } from "../contexts/ClientContext"
import { useCampaign } from "../contexts/CampaignContext"
import GamemasterOnly from "../components/GamemasterOnly"

import type { Campaign, Fight, Toast, ServerSideProps } from "../types/types"

interface HomeProps {
  fights: Fight[]
  currentCampaign: Campaign | null
}

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const getCurrentCampaign = async () => {
    const response = await client.getCurrentCampaign()
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
    return null
  }

  const currentCampaign = await getCurrentCampaign()

  const response = await client.getFights()

  if (response.status === 200) {
    const fights = await response.json()
    return {
      props: {
        fights: fights,
        currentCampaign: currentCampaign
      }, // will be passed to the page component as props
    }
  }
  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
      }
    }
  }
  return {
    props: {
      fights: [],
    }
  }
}

export default function Home({ currentCampaign, fights:initialFights }: HomeProps) {
  const [fights, setFights] = useState<Fight[]>(initialFights)
  const { status, data }: any = useSession({ required: true })
  const { toast } = useToast()
  const [showHidden, setShowHidden] = useState<boolean>(false)
  const { user } = useClient()

  const filterFights = (fights: Fight[], showHidden: boolean) => {
    if (showHidden) return fights
    return fights.filter((fight: Fight) => (fight.active))
  }

  const filteredFights = useMemo(() => filterFights(fights, showHidden), [fights, showHidden])

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }

  if (status !== "authenticated") {
    return <div>Loading...</div>
  }
  return (
    <>
      <Head>
        <title>Chi War - Feng Shui 2 Shot Counter and Character Manager</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Fights</Typography>
            <GamemasterOnly user={user}>
              <ButtonBar>
                <Stack direction="row" spacing={2}>
                  { currentCampaign?.id && <AddFight setFights={setFights} /> }
                  <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
                </Stack>
              </ButtonBar>
            </GamemasterOnly>
            { !!filteredFights.length &&
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{"& th": { color: "text.secondary" }}}>
                      <TableCell>Fight</TableCell>
                      <TableCell>Characters</TableCell>
                      <TableCell>Shot</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{"& tr": { "& td": { color: "text.primary" }}}}>
                    {filteredFights.map((fight: Fight) => <FightDetail fight={fight} key={fight.id} setFights={setFights} />)}
                  </TableBody>
                </Table>
              </TableContainer> }
            { !filteredFights.length && <Typography pt={5}>There are no available fights. Some fights might be hidden by the gamemaster.</Typography> }
          </Container>
        </Layout>
      </main>
    </>
  )
}
