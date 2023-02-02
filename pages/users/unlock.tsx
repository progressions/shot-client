import Layout from '../../components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import Navbar from "../../components/navbar/Navbar"

import { Stack, Link, Container, Typography, Box } from "@mui/material"

import { useRouter } from 'next/router'
import { getServerClient } from "../../utils/getServerClient"

import Client from '../../components/Client'
import type { QueryType, AuthSession, ServerSideProps, User } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { unlock_token } = query as QueryType

  const response = await client.unlockUser(unlock_token as string)

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
        success: false,
        errors: errors,
        not_found: false
      }
    }
  }

  if (response.status === 404) {
    return {
      props: {
        success: false,
        errors: {},
        not_found: true
      }
    }
  }

  return {
    props: {
      success: true,
      errors: {},
      not_found: false
    }
  }
}

interface UnlockUserProps {
  success: boolean
  errors: {}
  not_found: boolean
}

export default function UnlockUser({ success, errors, not_found }: UnlockUserProps) {
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
