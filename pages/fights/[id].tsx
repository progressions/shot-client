import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Divider, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Container, Typography } from '@mui/material'
import Layout from '../../components/Layout'
import Shot from '../../components/Shot'
import AddCharacter from '../../components/character/AddCharacter'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import FavoriteIcon from '@mui/icons-material/Favorite'
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
  if (result.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
        endpoint: endpoint
      }
    }
  }
  return {
    props: {
      endpoint: endpoint,
      signedIn: false
    }
  }
}

export default function Fight({ fight:initialFight, endpoint }: any) {
  const [fight, setFight] = useState(initialFight)

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
        <Container>
          <Typography variant="h1" gutterBottom>{fight.name}</Typography>
          <AddCharacter fight={fight} endpoint={endpoint} setFight={setFight} />
          <TableContainer>
            <Table border={0}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{width: 80}} />
                  <TableCell sx={{width: 50}}>
                  </TableCell>
                  <TableCell sx={{width: 200}}>
                    <Typography variant="h4">Name</Typography>
                  </TableCell>
                  <TableCell sx={{width: 65}}>
                    <Typography variant="h4" color='error'><FavoriteIcon sx={{width: 30, height: 30}} /></Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h4">Action Values</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <TableContainer>
            <Table border={0}>
              <TableBody>
                {
                  fight.shot_order.map(([shot, chars]: any) => <Shot key={shot} shot={shot} characters={chars} endpoint={endpoint} fight={fight} setFight={setFight} />)
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Layout>
    </>
  )
}

/*
              <TableHead>
                <TableRow>
                  <TableCell sx={{width: 50}}>
                  </TableCell>
                  <TableCell sx={{width: 200}}>
                    <Typography variant="h4">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h4">Wounds</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h4">Action Values</Typography>
                  </TableCell>
                  <TableCell sx={{width: 100}}>
                  </TableCell>
                </TableRow>
              </TableHead>
*/
