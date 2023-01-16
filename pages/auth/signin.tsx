import Head from 'next/head'
import { Alert, Snackbar, Box, Stack, TextField, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Router from 'next/router'

import Layout from '../../components/Layout'
import type { ServerSideProps } from "../../types/types"

interface SignInPageProps {
  referer: string | null
}

interface Credentials {
  email: string,
  password: string
}

export async function getServerSideProps({ req, query }: ServerSideProps) {

  console.log({ query })

  // get CSRF as soon as i figure out how
  return {
    props: {
      referer: query.path || req.headers['referer'] || null
    },
  }
}

export default function SignInPage({ referer }: SignInPageProps) {
  const [error, setError] = useState<boolean>(false)
  useEffect(() => {
    signOut({ redirect: false })
  })

  const [credentials, setCredentials] = useState<Credentials>(
    {
      email: '',
      password: ''
    }
  )

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
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
      setError(true)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCredentials((prevState: Credentials) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <Head>
        <title>Sign In | Shot Counter</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout unauthenticated>
          <Box margin="auto" sx={{width: 300}} p={4} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1}>
              { error && (<Alert severity={'error'}>You have entered an invalid email or password.</Alert>) }
              <TextField autoFocus required error={error} id="email" label="Email Address" name="email" value={credentials.email} onChange={handleChange} />
              <TextField required id="password" error={error} label="Password" name="password" value={credentials.password} onChange={handleChange} type="password" />
              <Button variant="contained" type="submit">Sign In</Button>
            </Stack>
          </Box>
        </Layout>
      </main>
    </>
  )
}
