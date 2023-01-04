import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Switch, Divider, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Container, Typography } from '@mui/material'
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

import FightToolbar from '../../components/FightToolbar'
import Layout from '../../components/Layout'
import Shot from '../../components/Shot'
import CharacterModal from '../../components/character/CharacterModal'

export async function getServerSideProps({ req, res, params }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const apiEndpoint = `${process.env.SERVER_URL}/api/v1`
  const endpoint = `${process.env.SERVER_URL}/api/v1/fights`
  const { id } = params
  const response = await fetch(`${endpoint}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })
  if (response.status === 200) {
    const fight = await response.json()
    return {
      props: {
        fight: fight,
        endpoint: endpoint,
        apiEndpoint: apiEndpoint,
        signedIn: true
      }, // will be passed to the page component as props
    }
  }
  if (response.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin"
      },
      props: {
        endpoint: endpoint,
        apiEndpoint: apiEndpoint,
      }
    }
  }
  return {
    props: {
      endpoint: endpoint,
      apiEndpoint: apiEndpoint,
    }
  }
}

export default function Fight({ fight:initialFight, endpoint, apiEndpoint }: any) {
  const [fight, setFight] = useState(initialFight)
  const [editingCharacter, setEditingCharacter] = useState(null)
  const [showHidden, setShowHidden] = useState(false)

  const router = useRouter()
  const { id } = router.query
  if (!fight) {
    return <>Loading...</>
  }
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
          <FightToolbar fight={fight} endpoint={apiEndpoint} setFight={setFight} showHidden={showHidden} setShowHidden={setShowHidden} />
          <TableContainer>
            <Table border={0}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{width: 50}}>
                  </TableCell>
                  <TableCell sx={{width: 240}}>
                    <Typography variant="h4">Name</Typography>
                  </TableCell>
                  <TableCell sx={{width: 30}}>
                    <Typography variant="h4" color='error'><FavoriteIcon sx={{width: 30, height: 30}} /></Typography>
                  </TableCell>
                  <TableCell sx={{width: 350}}>
                    <Typography variant="h4">Action Values</Typography>
                  </TableCell>
                  <TableCell sx={{width: 100}}>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <TableContainer>
            <Table border={0}>
              <TableBody>
                {
                  fight.shot_order.map(([shot, chars]: any) => <Shot key={shot} shot={shot} characters={chars} endpoint={endpoint} fight={fight} setFight={setFight} editingCharacter={editingCharacter} setEditingCharacter={setEditingCharacter} showHidden={showHidden} />)
                }
              </TableBody>
            </Table>
          </TableContainer>
          <CharacterModal open={!!editingCharacter} setOpen={setEditingCharacter} endpoint={endpoint} fight={fight} character={editingCharacter} setFight={setFight} />
        </Container>
      </Layout>
    </>
  )
}
