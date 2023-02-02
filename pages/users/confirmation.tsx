import Layout from '../../components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import Navbar from "../../components/navbar/Navbar"

import { Stack, Link, Container, Typography, Box } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { useRouter } from 'next/router'

import Client from '../../components/Client'
import type { AuthSession, ServerSideProps, User } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: ServerSideProps) {
  const session: any = await getServerSession(req as NextApiRequest, res as NextApiResponse, authOptions) as AuthSession
  const jwt = session?.authorization as string
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
        user: null,
        errors: errors,
        not_found: false
      }
    }
  }

  if (response.status === 404) {
    return {
      props: {
        user: null,
        not_found: true,
      }
    }
  }

  const user = await response.json()

  return {
    props: {
      user: user,
      not_found: false
    }
  }
}

interface ConfirmationViewProps {
  user: User
  errors: { email?: string }
  not_found: boolean
}

export default function ConfirmationView({ user, errors, not_found }: ConfirmationViewProps) {
  return (
    <>
      <Head>
        <title>Confirm Account - Chi War</title>
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
