import Layout from '../../components/Layout'
import Head from 'next/head'

import { Box, Stack, TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import CreateInvitation from "../../components/invitations/CreateInvitation"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'

import PlayerDetails from "../../components/campaigns/PlayerDetails"
import { useClient } from "../../contexts/ClientContext"

import { useState } from "react"
import { Invitation, User, Campaign } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params

  const response = await client.getCampaign({ id })

  if (response.status === 200) {
    const campaign = await response.json()
    return {
      props: {
        campaign: campaign
      }
    }
  }

  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      }
    }
  }

  return {
    props: {
      campaign: {}
    }
  }
}

export default function CampaignView({ campaign:initialCampaign }: any) {
  const { client } = useClient()
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign)

  async function reloadCampaign(camp:Campaign) {
    const response = await client.getCampaign(camp)
    if (response.status === 200) {
      const data = await response.json()
      console.log("campaign", data)
      setCampaign(data)
    }
  }

  return (
    <>
      <Head>
        <title>Shot Counter</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h2" gutterBottom>{campaign.title}</Typography>
            <Typography>{campaign.description}</Typography>
            <Typography>Gamemaster: {campaign?.gamemaster?.first_name} {campaign?.gamemaster?.last_name}</Typography>
            <Stack direction="row">
              <CreateInvitation campaign={campaign} />
            </Stack>
            <Box mt={2}>
              <Typography variant="h3">Players</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>First</TableCell>
                      <TableCell>Last</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      campaign.players.map((player: User) => <PlayerDetails key={player?.id} player={player} campaign={campaign} reload={reloadCampaign} />)
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box mt={2}>
              <Typography variant="h3">Invitations</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      campaign.invitations.map((invitation: Invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell>{invitation.email}</TableCell>
                          <TableCell>{invitation.id}</TableCell>
                        </TableRow>
                      )
                    ) }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  )
}
