import Head from 'next/head'
import { Avatar, Box, Button, Stack, Container, Typography, TextField } from '@mui/material'
import Layout from '../components/Layout'
import { useSession } from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useState } from 'react'
import { useRouter } from "next/router"

export async function getServerSideProps({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const id = session?.id
  const endpoint = `${process.env.SERVER_URL}/api/v1/`

  if (!session?.user?.admin) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {}
    }
  }

  return {
    props: {
      jwt: jwt,
      user: session?.user,
      endpoint: endpoint,
    }, // will be passed to the page component as props
  }
}

export default function Admin({ jwt, endpoint }: any) {
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1">Admin</Typography>
          </Container>
        </Layout>
      </main>
    </>
  )
}
