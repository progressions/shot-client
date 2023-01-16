import Layout from '../../components/Layout'
import Head from 'next/head'

import { useState } from "react"

import { TextField, Button, Box, Stack, TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Container, Typography } from "@mui/material"

import { useSession } from 'next-auth/react'
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import CreateInvitation from "../../components/invitations/CreateInvitation"
import Client from '../../components/Client'
import { GetServerSideProps } from 'next'
import Navbar from "../../components/navbar/Navbar"

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
      destination: "/auth/signin"
    },
    props: {
    }
  }
}

export default function RedeemInvitation({ invitation }: any) {
  const [user, setUser] = useState({email: invitation?.email})
  const [saving, setSaving] = useState(false)

  const client = new Client()

  console.log(invitation)

  const handleChange = (event: any) => {
    setUser((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const cancelForm = () => {
    setUser({})
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const response = await client.redeemInvitation(invitation, user)
    if (response.status === 200) {
      const data = await response.json()
      console.log("success", data)
    } else {
      alert("wut")
      const data = await response.json()
      console.error(data)
    }

    setSaving(false)
    // redirect to the login page
  }

  return (
    <>
      <Head>
        <title>Shot Counter</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>Welcome</Typography>
          <Typography>You've been invited to </Typography>
          <Typography variant="h3" gutterBottom>{invitation.campaign.title}</Typography>
          <Typography>To accept, enter your details to create an account.</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2} mt={4}>
              <TextField name="email" label="Email" value={user.email || ""} InputProps={{
                readOnly: true,
              }} />
              <TextField name="first_name" label="First name" value={user.first_name || ""} onChange={handleChange} />
              <TextField name="last_name" label="Last name" value={user.last_name || ""} onChange={handleChange} />
              <TextField required name="password" type="password" label="Password" value={user.password || ""} onChange={handleChange} />
              <Stack spacing={2} direction="row">
                <Button variant="contained" type="submit" disabled={saving}>Accept</Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </main>
    </>
  )
}
