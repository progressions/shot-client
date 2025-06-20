import type { NextApiRequest, NextApiResponse } from "next"
import Head from 'next/head'
import { colors, Paper, Avatar, Box, Button, Stack, Container, Typography, TextField } from '@mui/material'
import Layout from '@/components/Layout'
import Client from '@/utils/Client'
import { useState } from 'react'
import Router from "next/router"
import { getServerClient } from "@/utils/getServerClient"
import { SaveCancelButtons, StyledTextField } from "@/components/StyledFields"
import ImageManager from "@/components/images/ImageManager"

import type { AuthSession, User, ServerSideProps } from "@/types/types"

interface ProfileProps {
  jwt: string,
  user: User
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const { client, jwt, session } = await getServerClient(req, res)
  const id = session?.id as string

  try {
    const user = await client.getUser({id: id})

    return {
      props: {
        jwt: jwt,
        user: user
      }
    }
  } catch(error) {
    return {
      props: {}
    }
  }
}

export default function Profile({ jwt, user:initialUser }: ProfileProps) {
  const client = new Client({ jwt })
  const [user, setUser] = useState<User>(initialUser)
  const [saving, setSaving] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [edited, setEdited] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEdited(true)
    setUser((prevState: User) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    await updateUser()
  }

  const updateUser = async (): Promise<void> => {
    setSaving(true)

    try {
      await client.updateUser(user)
      setSaving(false)
      setEdited(false)
      Router.reload()
    } catch(error) {
      console.error(error)
    }
  }

  const cancelForm = (): void => {
    setUser(initialUser)
    setSaving(false)
    setEdited(false)
  }

  async function deleteImage(user: User) {
    await client.deleteUserImage(user as User)
  }

  return (
    <>
      <Head>
        <title>Profile - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
            <Typography variant="h1">Profile</Typography>
            <Box component="form" onSubmit={handleUpdate}>
              <Stack spacing={2} sx={{width: 500}}>
                { !open &&
                <Button sx={{width: 100}} onClick={() => setOpen(!open)}>
                  <Avatar alt="N" src={user.avatar_url} sx={{ width: 100, height: 100 }} />
                </Button> }
                { open && user?.id && <ImageManager name="user" entity={user} updateEntity={updateUser} deleteImage={deleteImage} apiEndpoint="users" /> }
                <Stack spacing={2} direction="row">
                  <StyledTextField fullWidth name="first_name" label="First name" value={user.first_name} variant="outlined" onChange={handleChange} />
                  <StyledTextField fullWidth name="last_name" label="Last name" value={user.last_name} variant="outlined" onChange={handleChange} />
                </Stack>
                <StyledTextField name="email" label="Email" value={user.email} onChange={handleChange} variant="outlined" />
                <Stack alignItems="flex-end" spacing={2} direction="row">
                  <SaveCancelButtons disabled={saving || !edited} onCancel={cancelForm} />
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  )
}
