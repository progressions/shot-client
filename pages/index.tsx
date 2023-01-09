import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import AddFight from '../components/AddFight'
import FightDetail from '../components/FightDetail'
import Layout from '../components/Layout'
import Api from '../components/Api'
import Client from '../components/Client'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { NextApiRequest, NextApiResponse } from 'next'

import type { Fight } from "../types/types"

interface HomeProps {
  fights: Fight[]
}

interface ServerSideProps {
  req: NextApiRequest,
  res: NextApiResponse,
  params?: any
}

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const api = new Api()
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const response = await client.getFights()

  if (response.status === 200) {
    const fights = await response.json()
    return {
      props: {
        fights: fights,
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

export default function Home({ fights }: HomeProps) {
  const { status, data }: any = useSession({ required: true })
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
            <AddFight />
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
                  {fights.map((fight: Fight) => <FightDetail fight={fight} key={fight.id} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
