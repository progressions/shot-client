import Head from 'next/head'
import { Typography, Link, Alert, Box, Stack, TextField, Button } from '@mui/material'
import { useReducer, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Router from 'next/router'

import Layout from '../../components/Layout'
import type { ServerSideProps } from "../../types/types"
import { initialState, loginReducer } from "../../reducers/loginReducer"

interface SignInPageProps {
  referer: string | null
}

interface Credentials {
  email: string,
  password: string
}

export async function getServerSideProps({ req, query }: ServerSideProps) {
  // get referer as soon as i figure out how
  return {
    props: {
      referer: null
    },
  }
}

export default function SignInPage({ referer }: SignInPageProps) {
  const [state, dispatch] = useReducer(loginReducer, initialState)
  const { error, loading, email, password } = state

  useEffect(() => {
    signOut({ redirect: false })
  })

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    const result = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false
    })
    if (result?.status === 200) {
      if (referer) {
        Router.replace(referer)
      } else {
        Router.replace("/")
      }
    }
    if (result?.status === 401) {
      dispatch({ type: "error" })
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({ type: "update", name: event.target.name, value: event.target.value })
  }

  return (
    <>
      <Head>
        <title>Sign In | Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout unauthenticated>
          <Box margin="auto" sx={{width: 300}} p={4} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1}>
              { error && (<Alert severity={'error'}>You have entered an invalid email or password.</Alert>) }
              <TextField autoFocus required error={error} id="email" label="Email Address" name="email" value={email} onChange={handleChange} />
              <TextField required id="password" error={error} label="Password" name="password" value={password} onChange={handleChange} type="password" />
              <Typography><Link href="/users/password/reset">Forgot your password?</Link></Typography>
              <Button disabled={loading} variant="contained" type="submit">Sign In</Button>
            </Stack>
          </Box>
        </Layout>
      </main>
    </>
  )
}
