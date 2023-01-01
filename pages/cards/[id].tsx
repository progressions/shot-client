import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CardMedia, CardActions, Card, CardContent, ListItemAvatar, Avatar, Divider, Table, TableContainer, TableBody, TableRow, TableHead, TableCell, Paper, Container, Typography } from '@mui/material'
import Layout from '../../components/Layout'
import Shot from '../../components/Shot'
import AddCharacter from '../../components/character/AddCharacter'
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
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BoltIcon from '@mui/icons-material/Bolt'

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
        endpoint: endpoint
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
      endpoint: endpoint
    }
  }
}

export default function Fight({ fight, endpoint }: any) {
  const router = useRouter()
  const { id } = router.query
  const imageUrl = "https://www.ocregister.com/wp-content/uploads/migration/lfn/lfnm3e-b78741872z.120110126154423000glut0blk.1.jpg?w=620"
console.log(fight)
  if (!fight) {
    return (<div>Loading...</div>)
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
          <AddCharacter fight={fight} endpoint={endpoint} />
          <Stack>
            {
              fight?.shot_order.map(([shot, characters]: any) => {
                return (
                  <Stack key={`${shot}_stack`} direction="row" sx={{height: 250}}>
                    <Box key={shot} p={2} mr={2} sx={{width: 100, height: 100 }}>
                      <Typography variant="h1">{shot}</Typography>
                    </Box>
                    {
                      characters.map((character: any) => {
                        return (
                          <Box key={character.id} p={1} sx={{width: 150, height: 130 }}>
                            <Card>
                              <CardMedia component='img' height={60} image={imageUrl} />
                              <CardContent>
                                <Stack direction="row">
                                  <Typography gutterBottom variant='h5' component='div'>
                                    {character.name}
                                  </Typography>
                                </Stack>
                                  <Typography variant='body2'>
                                    Defense {character.defense}
                                  </Typography>
                              </CardContent>
                              <CardActions>
                                <IconButton size="small"><BoltIcon /></IconButton>
                                <IconButton size="small"><EditIcon /></IconButton>
                                <IconButton size="small"><DeleteIcon /></IconButton>
                              </CardActions>
                            </Card>
                          </Box>
                        )
                      }
                    )}
                  </Stack>
                )
              })
            }
          </Stack>
        </Container>
      </Layout>
    </>
  )
}
