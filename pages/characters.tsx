import Head from "next/head"
import Layout from "../components/Layout"

import { useState } from "react"
import Router from "next/router"

import { Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import { useSession } from "next-auth/react"

import ActionValues from "../components/character/ActionValues"
import ActionButtons from "../components/character/ActionButtons"
import CharacterModal from "../components/character/CharacterModal"
import AvatarBadge from "../components/character/AvatarBadge"
import NewCharacter from "../components/character/NewCharacter"
import CharacterFilters from "../components/CharacterFilters"

import type { Character } from "../components/character/CharacterModal"

export async function getServerSideProps({ req, res }: any) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const endpoint = `${process.env.SERVER_URL}/api/v1/all_characters`

  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt
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

export default function Characters({ endpoint, characters:initialCharacters, jwt }: any) {
  const session = useSession({ required: true })
  const { status, data } = session
  const [editingCharacter, setEditingCharacter] = useState(null)
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [filters, setFilters] = useState({
    type: null,
    name: null
  })

  function editCharacter(character: any) {
    setEditingCharacter(character)
  }

  const generateUrl = ({ endpoint, character }: any) => {
    if (character?.id) {
      return `${endpoint}/${character.id}`.replace("fights", "all_characters")
    } else {
      return endpoint.replace("fights", "all_characters")
    }
  }

  async function deleteCharacter(character: any) {
    const url = `${endpoint}/${character.id}`.replace("fights", "all_characters")
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": jwt
      }
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  if (status !== "authenticated") {
    return <div>Loading...</div>
  }

  const filteredCharacters = (characters: Character[]) => {
    return characters.filter((character) => {
      if (filters.type) {
        return character?.action_values?.["Type"] === filters.type
      } else {
        return true
      }
    }).filter((character) => {
      if (filters.name) {
        console.log(filters.name)
        console.log(character?.name)
        return new RegExp(filters.name, "gi").test(character.name)
      } else {
        return true
      }
    })
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
            <Stack direction="row" spacing={2} alignItems="center">
              <CharacterFilters filters={filters} setFilters={setFilters} />
              <NewCharacter endpoint={endpoint} />
            </Stack>
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
                    filteredCharacters(characters).map((character: Character) => {
                      return (<TableRow key={character.id}>
                        <TableCell sx={{width: 50}}>
                          <AvatarBadge character={character} session={session} />
                        </TableCell>
                        <TableCell sx={{fontWeight: "bold"}}><Typography variant="h5">{character.name}</Typography></TableCell>
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
