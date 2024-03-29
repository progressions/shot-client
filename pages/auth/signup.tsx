import Head from 'next/head'
import { Container, Typography, Avatar, Stack, TextField, Button, Box } from "@mui/material"
import { useState } from "react"
import Router from 'next/router'

import Layout from '@/components/Layout'
import Api from '@/utils/Api'
import Client from "@/utils/Client"

import type { User, ServerSideProps } from "@/types/types"
import { defaultUser } from "@/types/types"

export async function getServerSideProps({ req }: ServerSideProps) {

  // get CSRF as soon as i figure out how
  return {
    props: {
      referer: req.headers['referer'] || null
    },
  }
}

export default function SignUp() {
  const client = new Client()

  const [saving, setSaving] = useState<boolean>(false)
  const [user, setUser] = useState<User>(defaultUser)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevState:User) => { return { ...prevState, [event.target.name]: event.target.value }})
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    try {
      await client.createUser(user)
      Router.replace("/auth/signin")
    } catch(error) {
      console.error(error)
    }
  }

  const cancelForm = () => {
    setSaving(false)
    setUser(defaultUser)
  }

  return (
    <>
      <Head>
        <title>Sign Up | Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout unauthenticated>
          <Container maxWidth="md">
            <Typography variant="h1">Sign Up</Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2} sx={{width: 500}}>
                <Stack spacing={2} direction="row">
                  <TextField fullWidth name="first_name" label="First name" value={user.first_name} variant="outlined" onChange={handleChange} />
                  <TextField fullWidth name="last_name" label="Last name" value={user.last_name} variant="outlined" onChange={handleChange} />
                </Stack>
                <TextField name="email" required label="Email" value={user.email} onChange={handleChange} variant="outlined" />
                <TextField name="password" required label="Password" type="password" value={user.password} onChange={handleChange} variant="outlined" />
                <Stack alignItems="flex-end" spacing={2} direction="row">
                  <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                  <Button variant="contained" type="submit" disabled={saving}>Sign Up</Button>
                </Stack>
              </Stack>
            </Box>
          </Container>
        </Layout>
      </main>
    </>
  )
}
