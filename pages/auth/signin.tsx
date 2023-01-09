import { Alert, Snackbar, Box, Stack, TextField, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'
import Router from 'next/router'

import Layout from '../../components/Layout'
import Api from '../../components/Api'

interface SignInPageProps {
  referer: string | null
}

interface Credentials {
  email: string,
  password: string
}

export async function getServerSideProps(context: any) {

  // get CSRF as soon as i figure out how
  return {
    props: {
      referer: context?.req?.headers?.['referer'] || null
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

  const handleSubmit = async (event: any): Promise<void> => {
    event.preventDefault()
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false
    })
    if (result?.status === 200) {
      if (referer) {
        Router.replace("/")
      }
    }
    if (result?.status === 401) {
      setError(true)
      console.log("UNAUTHORIZED")
    }
  }

  const handleChange = (event: any): void => {
    setCredentials((prevState: Credentials) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  return (
    <Layout>
      <Box margin="auto" sx={{width: 300}} p={4} component="form" onSubmit={handleSubmit}>
        <Stack spacing={1}>
          { error && <Alert severity="error">You have entered an invalid email or password."</Alert> }
          <TextField autoFocus required error={error} id="email" label="Email Address" name="email" value={credentials.email} onChange={handleChange} />
          <TextField required id="password" error={error} label="Password" name="password" value={credentials.password} onChange={handleChange} type="password" />
          <Button variant="contained" type="submit">Sign In</Button>
        </Stack>
      </Box>
    </Layout>
  )
}
