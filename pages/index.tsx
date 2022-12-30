import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import AddFight from '../components/AddFight'
import Fight from '../components/Fight'
import Layout from '../components/Layout'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { useEffect } from 'react'

import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

export async function getServerSideProps({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })

  if (response.status === 200) {
    const fights = await response.json()
    return {
      props: {
        fights: fights,
        endpoint: endpoint,
      }, // will be passed to the page component as props
    }
  }
  return {
    props: {
      fights: [],
      endpoint: endpoint,
    }
  }
}

export default function Home({ fights, endpoint }: any) {
  const { status, data } = useSession({ required: true })
  if (status !== "authenticated") {
    return <div>Loading...</div>
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
            <Typography variant="h1" gutterBottom>Fights</Typography>
            <AddFight endpoint={endpoint} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fight</TableCell>
                    <TableCell>Characters</TableCell>
                    <TableCell>Shot</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fights.map((fight: any) => <Fight fight={fight} key={fight.id} endpoint={endpoint} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
