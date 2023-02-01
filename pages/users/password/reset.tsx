import Layout from '../../../components/Layout'
import Head from 'next/head'
import Navbar from "../../../components/navbar/Navbar"

import { TextField, Button, Stack, Link, Container, Typography, Box } from "@mui/material"

import { useRouter } from 'next/router'
import { User } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useReducer } from "react"
import { resetReducer, initialState } from "../../../components/passwords/resetReducer"

export default function SendResetPasswordView() {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [state, dispatch] = useReducer(resetReducer, initialState)
  const { success, error, loading, email } = state

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: "submit" })

    const response = await client.sendResetPasswordLink(email)
    if (response.status === 200) {
      dispatch({ type: "success" })
    } else {
      dispatch({ type: "error" })
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "update", name: event.target.name, value: event.target.value })
  }

  return (
    <>
      <Head>
        <title>Forgot Password - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Reset Password</Typography>
          {!success && <>
            <Typography>Enter your email to send a link to reset your password.</Typography>
            <Box component="form" onSubmit={handleSubmit} mt={3} width={300}>
              <Stack spacing={1}>
                <TextField required error={error} name="email" label="Email" value={email} onChange={handleChange} />
                <Button disabled={loading} variant="contained" type="submit">Sign In</Button>
              </Stack>
          </Box> </> }
          { success && <>
            <Typography>A link has been sent to your email address to reset your password.</Typography>
          </> }
        </Container>
      </main>
    </>
  )
}
