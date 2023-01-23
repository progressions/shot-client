import Layout from '../../components/Layout'
import Head from 'next/head'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

import { Paper, Typography, Container, Box, Stack, TextField, Button } from "@mui/material"

import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import ButtonBar from "../../components/ButtonBar"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'

import PlayerDetails from "../../components/characters/PlayerDetails"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"

import { useCallback, useReducer, useState } from "react"
import { User, Character } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params

  const response = await client.getCharacter({ id })

  if (response.status === 200) {
    const character = await response.json()
    return {
      props: {
        character: character
      }
    }
  }

  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      }
    }
  }

  return {
    props: {
      character: {}
    }
  }
}

export default function CharacterView({ character:initialCharacter }: any) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const initialState = {
    loading: false,
    saving: false,
    character: initialCharacter
  }

  const characterReducer = useCallback((state: any, action: any) => {
    switch(action.type) {
      default:
        return initialState
    }
  }, [initialState])

  const [state, dispatch] = useReducer(characterReducer, initialState)
  const { loading, saving, character } = state

  async function handleSubmit(event: any) {
  }

  function handleChange(event: any) {
  }

  function cancelForm() {
  }

  return (
    <>
      <Head>
        <title>Characters - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md" component={Paper} sx={{marginTop: 2, py: 2}}>
            <Typography variant="h2" gutterBottom>Edit Character</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <TextField name="name" label="Name" required autoFocus fullWidth onChange={handleChange} value={character.name} />
                <Stack spacing={2} direction="row">
                  <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
                  <Button variant="contained" color="primary" type="submit" disabled={saving}>Save Changes</Button>
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  )
}

