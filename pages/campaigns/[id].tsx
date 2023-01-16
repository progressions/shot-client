import Layout from '../../components/Layout'
import Head from 'next/head'

import { TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import Client from '../../components/Client'
import { GetServerSideProps } from 'next'

import { User, Campaign } from "../../types/types"

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

  return {
    props: {
      campaign: {}
    }
  }
}

export default function CampaignView({ campaign }: any) {
  console.log({ campaign })
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
            <Typography>Gamemaster: {campaign.gamemaster.first_name} {campaign.gamemaster.last_name}</Typography>
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
                    campaign.players.map((player: User) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.email}</TableCell>
                        <TableCell>{player.first_name}</TableCell>
                        <TableCell>{player.last_name}</TableCell>
                        <TableCell>
                        </TableCell>
                      </TableRow>
                    )
                  ) }
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
