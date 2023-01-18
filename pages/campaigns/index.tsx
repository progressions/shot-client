import Layout from '../../components/Layout'
import Head from 'next/head'

import { useCallback, useMemo, useEffect, useState } from "react"
import { Paper, IconButton, Button, Stack, Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import Client from '../../components/Client'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "../../contexts/ToastContext"
import { useCampaign } from "../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import CreateCampaign from "../../components/campaigns/CreateCampaign"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

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

export default function Campaigns({ campaigns:initialCampaigns }: any) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])
  const { setToast } = useToast()
  const { campaign:currentCampaign, setCurrentCampaign } = useCampaign()

  const getCampaigns = useCallback(async () => {
    const response = await client.getCampaigns()
    if (response.status === 200) {
      const data = await response.json()
      setCampaigns(data)
    }
  }, [client])

  useEffect(() => {
    if (jwt) {
      getCampaigns().catch(console.error)
    }
  }, [jwt, getCampaigns])

  const deleteCampaign = async (campaign: Campaign) => {
    const confirmation = confirm("Delete campaign? This cannot be undone.")
    if (confirmation) {
      const response = await client.deleteCampaign(campaign)
      if (response.status === 200) {
        setToast({ open: true, message: `${campaign.title} deleted.`, severity: "success" })
        await getCampaigns()
      }
    }
  }

  const startCampaign = async (camp?: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      setToast({ open: true, message: `${camp.title} activated`, severity: "success" })
    } else {
      setToast({ open: true, message: `Campaign cleared`, severity: "success" })
    }
    await getCampaigns()
    return ""
  }

  const startStopCampaignButton = (campaign: Campaign, current: Campaign | null) => {
    if (campaign.id === current?.id) {
      return (
        <IconButton color="primary" onClick={() => startCampaign(null)}>
          <StopCircleIcon />
        </IconButton>
      )
    }
    return (
      <IconButton color="primary" onClick={() => startCampaign(campaign)}>
        <PlayCircleIcon />
      </IconButton>
    )
  }

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
            <CreateCampaign reload={getCampaigns} />
            <TableContainer>
              <Table size="small" component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    campaigns.map((campaign: Campaign) => {
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <Link href={`/campaigns/${campaign.id}`}>
                              {campaign.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            { startStopCampaignButton(campaign, currentCampaign) }
                            <IconButton color="primary" onClick={() => deleteCampaign(campaign)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
