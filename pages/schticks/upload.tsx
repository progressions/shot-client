import Layout from '@/components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import { useState } from "react"
import { Stack, Box, Button, Container, Typography, TextField } from "@mui/material"
import { useClient, useToast } from "@/contexts"

import Client from "@/utils/Client"

import type { Schtick } from "@/types/types"

export default function UploadSchticks() {
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState("")
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      await client.uploadSchticks(content)
      toastSuccess("Schticks uploaded.")
      cancelForm()
    } catch(error) {
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
        <title>Schticks - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="md">
            <Typography variant="h3" gutterBottom>Schticks</Typography>
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


