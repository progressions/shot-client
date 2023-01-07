import { Box, Stack, TextField, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { signIn, signOut } from 'next-auth/react'
import Router from 'next/router'

export async function getServerSideProps(context: any) {
  const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/sign_in`

  console.log(context?.req?.headers?.['referer'])

  // get CSRF as soon as i figure out how
  return {
    props: {
      endpoint: endpoint,
      referer: context?.req?.headers?.['referer'] || null
    },
  }
}

export default function SignInPage({ endpoint, referer }: any) {
  useEffect(() => {
    signOut({ redirect: false })
  })

  const [credentials, setCredentials] = useState(
    {
      email: '',
      password: ''
    }
  )

  const handleSubmit = async (event: any) => {
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
  }

  const handleChange = (event: any) => {
    setCredentials((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  return (
    <Layout>
      <Box margin="auto" sx={{width: 300}} p={4} component="form" onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <TextField autoFocus required id="email" label="Email Address" name="email" value={credentials.email} onChange={handleChange} />
          <TextField required id="password" label="Password" name="password" value={credentials.password} onChange={handleChange} type="password" />
          <Button variant="contained" type="submit">Sign In</Button>
        </Stack>
      </Box>
    </Layout>
  )
}
