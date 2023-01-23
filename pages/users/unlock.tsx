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
  const { unlock_token } = query

  const response = await client.unlockUser(unlock_token)

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

  if (response.status === 404) {
    return {
      props: {
        not_found: true,
      }
    }
  }

  return {
    props: {
      success: true
    }
  }
}

export default function UnlockUser({ success, errors, not_found }: any) {
  return (
    <>
      <Head>
        <title>Unlock Account - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Welcome</Typography>
          { not_found && <>
            <Typography>That account could not be found.</Typography>
          </> }
          { success && <>
            <Stack spacing={2}>
              <Typography>
                You have unlocked your account.
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
