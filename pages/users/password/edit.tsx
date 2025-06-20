import Layout from '@/components/Layout'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from "next"

import Navbar from "@/components/navbar/Navbar"

import { colors, Paper, TextField, Button, Stack, Link, Container, Typography, Box } from "@mui/material"
import { StyledTextField, SaveCancelButtons } from "@/components/StyledFields"

import { useRouter } from 'next/router'
import Client from '@/utils/Client'
import { QueryType, AuthSession, ServerSideProps, PasswordWithConfirmation, User } from "@/types/types"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { getServerClient } from "@/utils/getServerClient"

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

    try {
      await client.resetUserPassword(reset_password_token, state)
      setSuccess(true)
      toastSuccess("Password reset.")
    } catch(error) {
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
        <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
          <Box margin="auto" component="form" onSubmit={handleSubmit} mt={3} width={300}>
          <Typography variant="h4" gutterBottom>Welcome</Typography>
          { !success && <>
          <Typography gutterBottom>Enter a new password.</Typography>
            <Stack spacing={2}>
              <StyledTextField
                name="password"
                type="password"
                label="Password"
                onChange={handleChange}
                value={state.password}
                disabled={saving}
                required
              />
              <StyledTextField
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
                <SaveCancelButtons saving={saving} onCancel={cancelForm} onSubmit={handleSubmit} />
              </Stack>
            </Stack>
        </> }
        { success &&
          <Typography>Your password has been reset. <Link href="/auth/signin">Click here</Link> to sign in.</Typography>
        }
          </Box>
        </Container>
      </main>
    </>
  )
}
