import Layout from '../../../components/Layout'
import Head from 'next/head'

import Navbar from "../../../components/navbar/Navbar"

import { TextField, Button, Stack, Link, Container, Typography, Box } from "@mui/material"

import { authOptions } from '../../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { useRouter } from 'next/router'
import Client from '../../../components/Client'
import { User } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"

import { useState } from "react"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { reset_password_token } = query

  return {
    props: {
      reset_password_token: reset_password_token || null
    }
  }
}

export default function ResetPasswordView({ reset_password_token }: any) {
  const [state, setState] = useState({password: "", password_confirmation: ""})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  function handleChange(event: any) {
    setState((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event: any) {
    setSaving(true)

    const response = await client.resetUserPassword(reset_password_token, state)

    if (response.status === 200) {
      setSuccess(true)
      toastSuccess("Password reset.")
    } else {
      toastError()
      setSuccess(false)
    }

    cancelForm()
    setSaving(false)
  }

  function cancelForm() {
    setState({password: "", password_confirmation: ""})
  }

  const error = state.password_confirmation != state.password

  return (
    <>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Welcome</Typography>
          { !success && <>
          <Typography>Enter a new password.</Typography>
          <Box component="form" onSubmit={handleSubmit} mt={3} width={300}>
            <Stack spacing={1}>
              <TextField
                name="password"
                type="password"
                label="Password"
                onChange={handleChange}
                value={state.password}
                disabled={saving}
                required
              />
              <TextField
                name="password_confirmation"
                type="password"
                label="Password"
                onChange={handleChange}
                value={state.password_confirmation}
                required
                error={error}
                disabled={saving}
                helperText={error && "Does not match"}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" color="primary" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </Box>
        </> }
        </Container>
      </main>
    </>
  )
}
