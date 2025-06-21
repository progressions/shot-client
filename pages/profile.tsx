import type { NextApiRequest, NextApiResponse } from "next"
import Head from 'next/head'
import { colors, Paper, Avatar, Box, Button, Stack, Container, Typography, TextField } from '@mui/material'
import Layout from '@/components/Layout'
import Client from '@/utils/Client'
import { useEffect, useState, useReducer } from 'react'
import Router from "next/router"
import { getServerClient } from "@/utils/getServerClient"
import { SaveCancelButtons, StyledTextField } from "@/components/StyledFields"
import ImageManager from "@/components/images/ImageManager"
import { userReducer, UserActions, initialUserState } from "@/reducers/userState"
import { useClient, useToast } from "@/contexts"

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
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [state, dispatch] = useReducer(userReducer, initialUserState)
  const { user, edited, saving } = state
  const { first_name, last_name, email } = user || {}

  const [open, setOpen] = useState<boolean>(false)

  async function getUser(user: User) {
    if (!user?.id) {
      console.warn("No user ID found, cannot fetch user data.")
      return
    }
    try {
      const userData = await client.getUser({ id: user?.id })
      dispatch({ type: UserActions.USER, payload: userData })
    } catch(error) {
      console.error(error)
      toastError("Failed to load user data.")
    }
  }

  useEffect(() => {
    dispatch({ type: UserActions.USER, payload: initialUser })
  }, [initialUser])

  useEffect(() => {
    if (user?.id && saving) {
      getUser(user).catch(toastError)
    }
  }, [user, saving])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: UserActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    await updateUser()
  }

  const updateUser = async (): Promise<void> => {
    dispatch({ type: UserActions.SUBMIT })

    try {
      await client.updateUser(user)
      setOpen(false)
      toastSuccess("Profile updated successfully.")
    } catch(error) {
      console.error(error)
    }
  }

  const cancelForm = (): void => {
    dispatch({ type: UserActions.RESET })
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
            <Box component="form" onSubmit={handleUpdate}>
              <Stack spacing={2} sx={{width: 500}}>
                { !open &&
                <Button sx={{width: 100}} onClick={() => setOpen(!open)}>
                  <Avatar alt="N" src={user.avatar_url} sx={{ width: 100, height: 100 }} />
                </Button> }
                { open && user?.id && <ImageManager name="user" entity={user} updateEntity={updateUser} deleteImage={deleteImage} apiEndpoint="users" /> }
                <Stack spacing={2} direction="row">
                  <StyledTextField fullWidth name="first_name" label="First name" value={first_name || ""} variant="outlined" onChange={handleChange} />
                  <StyledTextField fullWidth name="last_name" label="Last name" value={last_name || ""} variant="outlined" onChange={handleChange} />
                </Stack>
                <StyledTextField name="email" label="Email" value={email} variant="outlined" onChange={handleChange} />
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
