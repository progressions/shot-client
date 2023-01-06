import Head from "next/head"
import Layout from "../components/Layout"

import { useState } from 'react'
import Router from 'next/router'

import { Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import { useSession } from "next-auth/react"

import ActionValues from "../components/character/ActionValues"
import ActionButtons from "../components/character/ActionButtons"
import CharacterModal from '../components/character/CharacterModal'

import type { Character } from "../components/character/CharacterModal"

export async function getServerSideProps({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const endpoint = `${process.env.SERVER_URL}/api/v1/all_characters`

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': jwt
    }
  })

  if (response.status === 200) {
    const characters = await response.json()
    return {
      props: {
        characters: characters,
        endpoint: endpoint,
        jwt: jwt
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
      }
    }
  }
  return {
    props: {
      characters: [],
      endpoint: endpoint,
    }
  }
}

export default function Characters({ endpoint, characters, jwt }: any) {
  const { status, data } = useSession({ required: true })
  const [editingCharacter, setEditingCharacter] = useState(null)

  function editCharacter(character: any) {
    setEditingCharacter(character)
  }

  const generateUrl = ({ endpoint, fight, character }: any) => {
    if (fight?.id && character?.id) {
      return `${endpoint}/${fight.id}/characters/${character.id}`
    } else if (fight?.id) {
      return `${endpoint}/${fight.id}/characters`
    } else if (character?.id) {
      return `${endpoint}/${character.id}`.replace("fights", "all_characters")
    } else {
      return endpoint.replace("fights", "all_characters")
    }
  }

  async function deleteCharacter(character: any) {
    const url = `${endpoint}/${character.id}`.replace("fights", "all_characters")
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  if (status !== "authenticated") {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Characters</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="lg">
            <Typography variant="h1" gutterBottom>Characters</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell />
                    <TableCell>Creator</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    characters.map((character: Character) => {
                      return (<TableRow key={character.id}>
                        <TableCell sx={{width: 50}}>
                          <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
                        </TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}><Typography variant="h5">{character.name}</Typography></TableCell>
                        <TableCell>{character.action_values?.["Type"]}</TableCell>
                        <TableCell><ActionValues character={character} /></TableCell>
                        <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
                        <TableCell><ActionButtons editCharacter={editCharacter} deleteCharacter={deleteCharacter} character={character} /></TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <CharacterModal open={!!editingCharacter} setOpen={setEditingCharacter} endpoint={endpoint} character={editingCharacter} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
