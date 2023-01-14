import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Snackbar, Alert, Link, Button, Paper, Container, Table, TableContainer, TableBody, TableHead, TableRow, TableCell, Typography } from '@mui/material'
import AddFight from '../components/AddFight'
import FightDetail from '../components/fights/FightDetail'
import Layout from '../components/Layout'
import Api from '../components/Api'
import Client from '../components/Client'
import PopupToast from '../components/PopupToast'
import Router from 'next/router'
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import { useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

import { useToast } from "../contexts/ToastContext"

import type { Fight, Toast, ServerSideProps } from "../types/types"

interface HomeProps {
  fights: Fight[]
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

export default function Home({ fights:initialFights }: HomeProps) {
  const [fights, setFights] = useState<Fight[]>(initialFights)
  const { status, data }: any = useSession({ required: true })
  const { toast, closeToast } = useToast()

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
            <AddFight setFights={setFights} />
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
                  {fights.map((fight: Fight) => <FightDetail fight={fight} key={fight.id} setFights={setFights} />)}
                </TableBody>
              </Table>
            </TableContainer>
            <PopupToast toast={toast} closeToast={closeToast} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
