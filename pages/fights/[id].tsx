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

export async function getServerSideProps(context: any) {
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const { id } = context.params
  const res = await fetch(`${endpoint}/${id}`)
  const fight = await res.json()
  return {
    props: {
      fight: fight,
      endpoint: endpoint,
    }, // will be passed to the page component as props
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
          <Typography variant="h2">Shot Counter</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {fight.shot_order.map(([shot, chars]: any) => <Shot key={shot} shot={shot} characters={chars} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  )
}
