import Layout from '@/components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import Navbar from "@/components/navbar/Navbar"

import { colors, Paper, Stack, Link, Container, Typography, Box } from "@mui/material"

import { useRouter } from 'next/router'
import { getServerClient } from "@/utils/getServerClient"

import Client from '@/utils/Client'
import type { QueryType, AuthSession, ServerSideProps, User } from "@/types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { confirmation_token } = query as QueryType

  try {
    const user = await client.confirmUser(confirmation_token as string)

    return {
      props: {
        user: user,
        not_found: false
      }
    }
  } catch(error) {
    return {
      props: {
        user: null,
        not_found: true,
      }
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
        <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
          <Typography variant="h4" gutterBottom>Welcome</Typography>
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
