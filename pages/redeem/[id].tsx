import Layout from '../../components/Layout'
import Head from 'next/head'
import URL from "node:url"

import Router from 'next/router'
import { useEffect, useState } from "react"

import { Link, TextField, Button, Box, Stack, TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { useSession } from 'next-auth/react'
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import CreateInvitation from "../../components/invitations/CreateInvitation"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'
import Navbar from "../../components/navbar/Navbar"
import * as cookie from 'cookie'
import { signIn, signOut } from 'next-auth/react'
import { useClient } from "../../contexts/ClientContext"

import { Invitation, User, Campaign } from "../../types/types"

export async function getServerSideProps<GetServerSideProps>({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params


  const response = await client.getInvitation({ id })
  if (response.status === 200) {
    const data = await response.json()

    return {
      props: {
        invitation: data
      }
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: `/auth/signin`
    },
    props: {
    }
  }
}

export default function RedeemInvitation({ invitation }: any) {
  const [user, setUser] = useState<User>({email: invitation?.email} as User)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user:currentUser, session } = useClient()
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (invitation.pending_user?.id) {
      setUser(invitation.pending_user)
    }
  }, [session.status, currentUser, invitation])

  const client = new Client()

  const handleChange = (event: any) => {
    setUser((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const cancelForm = () => {
    setUser({} as User)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const response = await client.redeemInvitation(invitation, user)
    if (response.status === 200) {
      const data = await response.json()
      setSuccess(true)
    } else {
      const data = await response.json()
      setErrors(data)
    }

    setSaving(false)
    // redirect to the login page
  }

  return (
    <>
      <Head>
        <title>Redeem Invitation - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Welcome</Typography>
          { success &&
            <Box my={2}>
              <Typography variant="h5">{invitation.email}</Typography>
              <Typography>
                You have joined the campaign.
              </Typography>
                { !currentUser?.id &&
                <Typography>
                  <Link href="/auth/signin">Click here</Link> to sign in.
                </Typography> }
              <Typography variant="h3" gutterBottom>{invitation.campaign.title}</Typography>
            </Box> }
          { !success && invitation.pending_user?.id &&
            <Box my={2}>
              <Typography>{invitation.email}</Typography>
              <Typography>
                You&rsquo;ve been invited to the campaign.
              </Typography>
              <Typography variant="h3" gutterBottom>{invitation.campaign.title}</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit" disabled={saving}>Accept</Button>
                </Stack>
              </Box>
            </Box> }
          { !success && !invitation.pending_user?.id && session.status !== "authenticated" &&
            <Box component="form" onSubmit={handleSubmit}>
              <Typography>You&rsquo;ve been invited to </Typography>
              <Typography variant="h3" gutterBottom>{invitation.campaign.title}</Typography>
              <Typography>To accept, enter your details to create an account.</Typography>
              <Stack direction="column" spacing={2} mt={4}>
                <TextField name="email" label="Email" required error={errors["email"]} helperText={errors["email"]} value={user?.email || ""} onChange={handleChange} InputProps={{
                  readOnly: invitation.email,
                }} />
                <TextField name="first_name" label="First name" value={user?.first_name || ""} onChange={handleChange} />
                <TextField name="last_name" label="Last name" value={user?.last_name || ""} onChange={handleChange} />
                <TextField required name="password" type="password" label="Password" value={user?.password || ""} onChange={handleChange} />
                <Stack spacing={2} direction="row">
                  <Button variant="contained" type="submit" disabled={saving}>Accept</Button>
                </Stack>
              </Stack>
            </Box> }
        </Container>
      </main>
    </>
  )
}
