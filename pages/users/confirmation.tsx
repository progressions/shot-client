import Layout from '../../components/Layout'
import Head from 'next/head'

import Navbar from "../../components/navbar/Navbar"

import { Stack, Link, Container, Typography, Box } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router'

import Client from '../../components/Client'
import { User } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { confirmation_token } = query

  const response = await client.confirmUser(confirmation_token)

  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      }
    }
  }

  if (response.status === 400) {
    const errors = await response.json()
    return {
      props: {
        errors: errors
      }
    }
  }

  const user = await response.json()

  console.log({ user })

  return {
    props: {
      user: user
    }
  }
}

export default function ConfirmationView({ user, errors }: any) {
  return (
    <>
      <Head>
        <title>Shot Counter</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Welcome</Typography>
          { errors && <>
            <Stack spacing={2}>
              <Typography>Your account {errors.email}</Typography>
              <Typography>
                <Link href="/auth/signin">Click here</Link> to sign in.
              </Typography>
            </Stack>
        </> }
          { user && <>
            <Stack spacing={2}>
              <Typography variant="h5">{user.email}</Typography>
              <Typography>
                You have confirmed your account.
              </Typography>
              <Typography>
                <Link href="/auth/signin">Click here</Link> to sign in.
              </Typography>
            </Stack>
          </> }
        </Container>
      </main>
    </>
  )
}
