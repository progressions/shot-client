import Layout from '@/components/Layout'
import Head from 'next/head'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import type { NextApiRequest, NextApiResponse } from "next"

import { Tooltip, IconButton, Box, Stack, TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { ButtonBar } from "@/components/StyledFields"
import CreateInvitation from "@/components/invitations/CreateInvitation"
import CreateOpenInvitation from "@/components/invitations/CreateOpenInvitation"
import Client from '@/utils/Client'
import { GetServerSideProps } from 'next'
import { getServerClient } from "@/utils/getServerClient"

import PlayerDetails from "@/components/campaigns/PlayerDetails"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"

import { useState } from "react"
import { ParamsType, AuthSession, ServerSideProps, Invitation, User, Campaign } from "@/types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { id } = params as ParamsType

  try {
    const campaign = await client.getCampaign({ id })

    return {
      props: {
        campaign: campaign
      }
    }
  } catch(error) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      }
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
    try {
      const data = await client.getCampaign(camp)
      setCampaign(data)
    } catch(error) {
      toastError()
    }
  }

  async function resendInvitation(invitation: Invitation) {
    try {
      await client.resendInvitation(invitation)
      await reloadCampaign(campaign)
      toastSuccess("Invitation re-sent.")
    } catch(error) {
      await reloadCampaign(campaign)
      toastError()
    }
  }

  async function deleteInvitation(invitation: Invitation) {
    try {
      await client.deleteInvitation(invitation)
      await reloadCampaign(campaign)
      toastSuccess("Invitation deleted.")
    } catch(error) {
      await reloadCampaign(campaign)
      toastError()
    }
  }

  return (
    <>
      <Head>
        <title>{campaign?.name || "Loading..."} - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h2" gutterBottom>{campaign.name}</Typography>
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
