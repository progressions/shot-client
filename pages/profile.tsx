import Head from 'next/head'
import { Avatar, Box, Button, Stack, Container, Typography, TextField } from '@mui/material'
import Layout from '../components/Layout'
import Client from '../components/Client'
import { useSession } from 'next-auth/react'
import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useState } from 'react'
import Router from "next/router"

import { NextApiRequest, NextApiResponse } from 'next'
import type { User } from "../types/types"

interface ProfileProps {
  jwt: string,
  user: User
}

interface ServerSideProps {
  req: NextApiRequest,
  res: NextApiResponse,
  params?: any
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt })
  const id = session?.id

  const response = await client.getUser({id: id})
  if (response.status === 200) {
    const user = await response.json()
    return {
      props: {
        jwt: jwt,
        user: user
      }, // will be passed to the page component as props
    }
  }
  return {
    props: {
    }
  }
}

export default function Profile({ jwt, user:initialUser }: ProfileProps) {
  const client = new Client({ jwt })
  const [user, setUser] = useState<User>(initialUser)
  const [saving, setSaving] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((prevState: User) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSaving(true)
    event.preventDefault()

    const response = await client.updateUser(user)
    setSaving(false)
    Router.reload()
  }

  const cancelForm = (): void => {
    setUser(initialUser)
    setSaving(false)
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1">Profile</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2} sx={{width: 500}}>
                <Avatar alt="N" src={user.avatar_url} sx={{ width: 100, height: 100 }} />
                <Stack spacing={2} direction="row">
                  <TextField fullWidth name="first_name" label="First name" value={user.first_name} variant="outlined" onChange={handleChange} />
                  <TextField fullWidth name="last_name" label="Last name" value={user.last_name} variant="outlined" onChange={handleChange} />
                </Stack>
                <TextField name="email" label="Email" value={user.email} onChange={handleChange} variant="outlined" />
                <Stack alignItems="flex-end" spacing={2} direction="row">
                  <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                  <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  )
}
