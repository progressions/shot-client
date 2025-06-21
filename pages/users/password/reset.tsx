import Layout from '@/components/Layout'
import Head from 'next/head'
import Navbar from "@/components/navbar/Navbar"

import { colors, Paper, TextField, Button, Stack, Link, Container, Typography, Box } from "@mui/material"

import { StyledTextField, SaveButton } from "@/components/StyledFields"
import { useRouter } from 'next/router'
import { User } from "@/types/types"
import { useClient, useToast } from "@/contexts"
import { useReducer } from "react"
import { resetReducer, initialState } from "@/components/passwords/resetReducer"

export default function SendResetPasswordView() {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [state, dispatch] = useReducer(resetReducer, initialState)
  const { success, error, loading, email } = state

  console.log("initialUser", initialUser)

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatch({ type: "submit" })

    try {
      await client.sendResetPasswordLink(email)
      dispatch({ type: "success" })
      toastSuccess("Reset password link sent.")
    } catch(error) {
      dispatch({ type: "error" })
      toastError()
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
        <Container maxWidth="md" component={Paper} sx={{backgroundColor: colors.blueGrey[300], color: "black", marginTop: 2, py: 2}}>
          <Box margin="auto" sx={{width: 300}} p={4} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>Reset Password</Typography>
          {!success && <>
            <Typography gutterBottom>Enter your email to send a link to reset your password.</Typography>
              <Stack spacing={1}>
                <StyledTextField required error={error} name="email" label="Email" value={email} onChange={handleChange} />
                <SaveButton disabled={loading} variant="contained" type="submit">Send Email</SaveButton>
              </Stack>
          </> }
          { success && <>
            <Typography>A link has been sent to your email address to reset your password.</Typography>
          </> }
        </Box>
        </Container>
      </main>
    </>
  )
}
