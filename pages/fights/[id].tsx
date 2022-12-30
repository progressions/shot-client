import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Divider, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Container, Typography } from '@mui/material'
import Layout from '../../components/Layout'
import Shot from '../../components/Shot'
import AddCharacter from '../../components/AddCharacter'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Router from "next/router"
import { authOptions } from '../api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

export async function getServerSideProps({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const { id } = params
  const result = await fetch(`${endpoint}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })
  if (result.status === 200) {
    const fight = await result.json()
    return {
      props: {
        fight: fight,
        endpoint: endpoint,
        signedIn: true
      }, // will be passed to the page component as props
    }
  }
  return {
    props: {
      endpoint: endpoint,
      signedIn: false
    }
  }
}

export default function Fight({ fight, endpoint }: any) {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Head>
        <title>{fight.name}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="md">
          <Typography variant="h1" gutterBottom>{fight.name}</Typography>
          <AddCharacter fight={fight} endpoint={endpoint} />
          <TableContainer>
            <Table size="small">
              <TableBody>
                {fight.shot_order.map(([shot, chars]: any) => <Shot key={shot} shot={shot} characters={chars} endpoint={endpoint} fight={fight} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  )
}
