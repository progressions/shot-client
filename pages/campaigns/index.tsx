import Layout from '../../components/Layout'
import Head from 'next/head'

import { useCallback, useMemo, useEffect, useState } from "react"
import { Box, Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCampaign } from "../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import ButtonBar from "../../components/ButtonBar"
import CreateCampaign from "../../components/campaigns/CreateCampaign"
import Campaigns from "../../components/campaigns/Campaigns"
import GamemasterOnly from "../../components/GamemasterOnly"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import Client from "../../components/Client"

import type { Campaign } from "../../types/types"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: any) {
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

  const response = await client.getCampaigns()

  if (response.status === 200) {
    const campaigns = await response.json()
    return {
      props: {
        currentCampaign: currentCampaign,
        campaigns: campaigns
      }
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

export default function CampaignsIndex({ campaigns:initialCampaigns }: any) {
  const [campaigns, setCampaigns] = useState(initialCampaigns["gamemaster"])
  const [playerCampaigns, setPlayerCampaigns] = useState(initialCampaigns["player"])
  const { client, user } = useClient()
  const { campaign:currentCampaign, setCurrentCampaign } = useCampaign()

  const getCampaigns = useCallback(async () => {
    const response = await client.getCampaigns()
    if (response.status === 200) {
      const data = await response.json()
      setCampaigns(data["gamemaster"])
      setPlayerCampaigns(data["player"])
    }
  }, [client])

  useEffect(() => {
    if (user) {
      getCampaigns().catch(console.error)
    }
  }, [user, getCampaigns])

  return (
    <>
      <Head>
        <title>Campaigns</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Campaigns</Typography>
            <GamemasterOnly user={user}>
              <ButtonBar>
                <CreateCampaign reload={getCampaigns} />
              </ButtonBar>
            </GamemasterOnly>
            <Typography mt={2} variant="h3" gutterBottom>As Gamemaster</Typography>
            <Campaigns campaigns={campaigns} getCampaigns={getCampaigns} />
            <Typography mt={2} variant="h3" gutterBottom>As Player</Typography>
            <Campaigns campaigns={playerCampaigns} getCampaigns={getCampaigns} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
