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
import Api from '../../components/Api'
import Client from '../../components/Client'

import type { Character, Fight, ID } from "../../types/types"
import { defaultCharacter, ServerSideProps } from "../../types/types"

interface FightParams {
  fight: Fight | null,
  notFound?: boolean
}

export async function getServerSideProps({ req, res, params }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt: jwt })
  const { id } = params

  const response = await client.getFight({id: id, shot_order: []})
  if (response.status === 200) {
    const fight = await response.json()

    return {
      props: {
        fight: fight,
      }, // will be passed to the page component as props
    }
  }
  if (response.status === 404) {
    return {
      props: {
        fight: null,
        notFound: true
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
      }
    }
  }
  return {
    props: {
    }
  }
}

export default function Fight({ fight:initialFight, notFound }: FightParams) {
  const [fight, setFight] = useState<Fight>(initialFight as Fight)
  const [editingCharacter, setEditingCharacter] = useState<Character>(defaultCharacter)
  const [showHidden, setShowHidden] = useState<boolean>(false)

  const router = useRouter()
  const { id } = router.query
  if (!fight && !notFound) {
    return <>Loading...</>
  }
  return (
    <>
      <Head>
        <title>{fight ? fight.name : "Fight not found"}</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          { !fight && <>
              <Typography sx={{mt: 5}} variant="h3">Fight not found.</Typography>
            </> }
          { fight && (<>
            <Typography variant="h1" gutterBottom>{fight.name}</Typography>
            <FightToolbar fight={fight} setFight={setFight} showHidden={showHidden} setShowHidden={setShowHidden} />
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
                    fight.shot_order.map(([shot, chars]: [number, Character[]]) => <Shot key={shot} shot={shot} characters={chars} fight={fight} setFight={setFight} editingCharacter={editingCharacter} setEditingCharacter={setEditingCharacter} showHidden={showHidden} />)
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <CharacterModal open={editingCharacter} setOpen={setEditingCharacter} fight={fight} character={editingCharacter} setFight={setFight} />
          </>)}
        </Container>
      </Layout>
    </>
  )
}
