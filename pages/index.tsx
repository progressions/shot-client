import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Switch, FormControlLabel, Stack, Snackbar, Alert, Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerClient } from "../utils/getServerClient"

import { ButtonBar } from "../components/StyledFields"
import AddFight from '../components/fights/AddFight'
import FightDetail from '../components/fights/FightDetail'
import Layout from '../components/Layout'
import Client from '../components/Client'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { useReducer, useMemo, useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { authOptions } from './api/auth/[...nextauth]'

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

import { useToast } from "../contexts/ToastContext"
import { useLocalStorage } from "../contexts/LocalStorageContext"
import { useClient } from "../contexts/ClientContext"
import { useCampaign } from "../contexts/CampaignContext"
import GamemasterOnly from "../components/GamemasterOnly"
import { FightsActions, initialFightsState, fightsReducer } from "../reducers/fightsState"

import type { FightsResponse, PaginationMeta, AuthSession, Campaign, Fight, ServerSideProps } from "../types/types"

interface HomeProps extends FightsResponse {
  currentCampaign: Campaign | null
}

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  const getCurrentCampaign = async () => {
    const response = await client.getCurrentCampaign()
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
    return null
  }

  const currentCampaign = await getCurrentCampaign()

  const fightsResponse = await client.getFights()

  return {
    props: {
      ...fightsResponse,
      currentCampaign: currentCampaign
    }
  }
}

export default function Home({ currentCampaign, fights:initialFights, meta }: HomeProps) {
  const [state, dispatch] = useReducer(fightsReducer, initialFightsState)
  const { client, user } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { loading, edited, fights, showHidden } = state

  useEffect(() => {
    const reload = async () => {
      try {
        const fightsResponse = await client.getFights({ show_all: showHidden } )
        dispatch({ type: FightsActions.FIGHTS, payload: fightsResponse })
      } catch(error) {
        toastError()
      }
    }

    if (user && edited) {
      reload()
    }
  }, [edited, user, dispatch, client, showHidden, toastError])

  useEffect(() => {
    const showHiddenFights = getLocally("showHiddenFights") || false
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!showHiddenFights })
  }, [getLocally, dispatch])

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    saveLocally("showHiddenFights", checked)
    dispatch({ type: FightsActions.UPDATE, name: "showHidden", value: !!checked })
  }

  if (loading) {
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
                  { currentCampaign?.id && <AddFight state={state} dispatch={dispatch} /> }
                  <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
                </Stack>
              </ButtonBar>
            </GamemasterOnly>
            { !!fights?.length &&
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
                    {
                      fights.map((fight: Fight) => (
                        <FightDetail
                          fight={fight}
                          key={fight.id}
                          state={state}
                          dispatch={dispatch}
                        />)
                      )
                    }
                  </TableBody>
                </Table>
              </TableContainer> }
            { !fights?.length && <Typography pt={5}>There are no available fights. Some fights might be hidden by the gamemaster.</Typography> }
          </Container>
        </Layout>
      </main>
    </>
  )
}
