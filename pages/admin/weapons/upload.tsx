import Layout from '../../../components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import { useState } from "react"
import { Stack, Box, Button, Container, Typography, TextField } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCampaign } from "../../../contexts/CampaignContext"
import { useSession } from 'next-auth/react'

import { authOptions } from '../../api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Client from "../../../components/Client"

import type { Weapon, ServerSideProps, Campaign } from "../../../types/types"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

export async function getServerSideProps<GetServerSideProps>({ req, res }: ServerSideProps) {
  const session: any = await getServerSession(req as NextApiRequest, res as NextApiResponse, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })

  const response = await client.getCurrentCampaign()

  if (response.status === 200) {
    const campaign = await response.json()
    return {
      props: {
      }
    }
  }
  if (response.status === 500) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
      }
    }
  }
  return {
    props: {
      fights: [],
    }
  }
}

export default function UploadWeapons() {
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState("")
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setSaving(true)

    const response = await client.uploadWeapons(content)
    if (response.status === 200) {
      toastSuccess("Weapons uploaded.")
      cancelForm()
    } else {
      toastError()
      cancelForm()
    }
  }

  function cancelForm() {
    setContent("")
    setSaving(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value)
  }

  return (
    <>
      <Head>
        <title>Weapons - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h1" gutterBottom>Weapons</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{width: 900}}>
              <Stack spacing={2}>
                <TextField name="file" onChange={handleChange} fullWidth required multiline rows={30} sx={{backgroundColor: "white", color: "black"}} InputProps={{sx: {color: "black"}}} />
                <Stack spacing={2} direction="row">
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
