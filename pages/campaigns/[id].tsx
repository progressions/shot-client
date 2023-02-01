import Layout from '../../components/Layout'
import Head from 'next/head'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

import { Tooltip, IconButton, Box, Stack, TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

import { ButtonBar } from "../../components/StyledFields"
import CreateInvitation from "../../components/invitations/CreateInvitation"
import CreateOpenInvitation from "../../components/invitations/CreateOpenInvitation"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'

import PlayerDetails from "../../components/campaigns/PlayerDetails"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"

import { useState } from "react"
import { ServerSideProps, Invitation, User, Campaign } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: ServerSideProps) {
  const session: any = await getServerSession(req as any, res as any, authOptions as any)
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

interface CampaignViewProps {
  campaign: Campaign
}

export default function CampaignView({ campaign:initialCampaign }: CampaignViewProps) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign)

  async function reloadCampaign(camp:Campaign) {
    const response = await client.getCampaign(camp)
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
    }
  }

  async function resendInvitation(invitation: Invitation) {
    const response = await client.resendInvitation(invitation)
    if (response.status === 200) {
      await reloadCampaign(campaign)
      toastSuccess("Invitation re-sent.")
    } else {
      await reloadCampaign(campaign)
      toastError()
    }
  }

  async function deleteInvitation(invitation: Invitation) {
    const response = await client.deleteInvitation(invitation)
    if (response.status === 200) {
      await reloadCampaign(campaign)
      toastSuccess("Invitation deleted.")
    } else {
      await reloadCampaign(campaign)
      toastError()
    }
  }

  return (
    <>
      <Head>
        <title>{campaign?.title || "Loading..."} - Chi War</title>
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
            <ButtonBar>
              <Stack direction="row" spacing={1}>
                <CreateInvitation campaign={campaign} />
                <CreateOpenInvitation campaign={campaign} />
              </Stack>
            </ButtonBar>
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
                      <TableCell />
                      <TableCell>Email</TableCell>
                      <TableCell>Maximum Count</TableCell>
                      <TableCell>Remaining Count</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      campaign.invitations.map((invitation: Invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell>{invitation.id}</TableCell>
                          <TableCell>{invitation.email}</TableCell>
                          <TableCell>{invitation.maximum_count}</TableCell>
                          <TableCell>{invitation.remaining_count}</TableCell>
                          <TableCell>
                            { invitation.email && <Tooltip title="Re-send invitation">
                              <IconButton color="primary" onClick={async () => await resendInvitation(invitation)}>
                                <SendIcon />
                              </IconButton>
                            </Tooltip> }
                            <Tooltip title="Delete invitation">
                              <IconButton color="primary" onClick={async () => await deleteInvitation(invitation)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
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
