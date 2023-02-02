import Layout from '../../../components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import Navbar from "../../../components/navbar/Navbar"

import { TextField, Button, Stack, Link, Container, Typography, Box } from "@mui/material"

import { useRouter } from 'next/router'
import Client from '../../../components/Client'
import { QueryType, AuthSession, ServerSideProps, PasswordWithConfirmation, User } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { getServerClient } from "../../../utils/getServerClient"

import { useState } from "react"

export async function getServerSideProps<GetServerSideProps>({ req, res, params, query }: ServerSideProps) {
  const { client } = await getServerClient(req, res)
  const { reset_password_token } = query as QueryType

  return {
    props: {
      reset_password_token: reset_password_token || null
    }
  }
}

interface ResetPasswordView {
  reset_password_token: string
}

export default function ResetPasswordView({ reset_password_token }: ResetPasswordView) {
  const [state, setState] = useState<PasswordWithConfirmation>({password: "", password_confirmation: ""})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState((prev: PasswordWithConfirmation) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
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
        <title>Reset Password - Chi War</title>
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
        { success && <>
        <Typography>Your password has been reset. <Link href="/auth/signin">Click here</Link> to sign in.</Typography>
        </> }
        </Container>
      </main>
    </>
  )
}
