import Layout from '../../components/Layout'
import Head from 'next/head'

import { useEffect, useState } from "react"
import { Link, Container, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material"
import Client from '../../components/Client'

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const getCurrentCampaign = async () => {
    const response = await client.getCurrentCampaign()
    const data = await response.json()
    return data
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

export default function Campaigns({ currentCampaign, campaigns:initialCampaigns }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)

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
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Campaign</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    campaigns.map((campaign) => {
                      return (
                        <TableRow>
                          <TableCell>
                            <Link href={`/campaigns/${campaign.id}`}>
                              {campaign.title}
                            </Link>
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
