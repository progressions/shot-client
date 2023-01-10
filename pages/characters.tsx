import Head from "next/head"
import Layout from "../components/Layout"
import Client from "../components/Client"

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
import CreateCharacter from "../components/character/CreateCharacter"
import CharacterFilters from "../components/CharacterFilters"
import PopupToast from "../components/PopupToast"

import type { Character, CharacterFilter, ServerSideProps, Toast } from "../types/types"
import { defaultCharacter } from "../types/types"

interface CharactersProps {
  characters: Character[],
  jwt: string
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt })

  const response = await client.getAllCharacters()

  if (response.status === 200) {
    const characters = await response.json()
    return {
      props: {
        characters: characters,
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
      }
    }
  }
  return {
    props: {
      characters: [],
    }
  }
}

export default function Characters({ characters:initialCharacters, jwt }: CharactersProps) {
  const client = new Client({ jwt })
  const session = useSession({ required: true })
  const { status, data } = session
  const [editingCharacter, setEditingCharacter] = useState<Character>(defaultCharacter)
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [filters, setFilters] = useState<CharacterFilter>({
    type: null,
    name: null
  })
  const [toast, setToast] = useState<Toast>({ open: false, message: "", severity: "success" })

  function editCharacter(character: Character): void {
    setEditingCharacter(character)
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteCharacter(character)

    if (response.status === 200) {
      Router.reload()
    }
  }

  const characterMatchesType = (character: Character): boolean => {
    if (filters.type) {
      return character.action_values?.["Type"] === filters.type
    } else {
      return true
    }
  }

  const characterMatchesName = (character: Character): boolean => {
    if (filters.name) {
      return new RegExp(filters.name, "gi").test(character.name)
    } else {
      return true
    }
  }

  const filteredCharacters = (characters: Character[]): Character[] => {
    return characters
      .filter(characterMatchesType)
      .filter(characterMatchesName)
  }

  if (status !== "authenticated") {
    return <div>Loading...</div>
  }

  const closeToast = (): void => {
    setToast((prevToast: Toast) => { return { ...prevToast, open: false }})
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
              <CreateCharacter setToast={setToast} />
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
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
                        <TableCell><ActionValues character={character} /></TableCell>
                        <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
                        <TableCell><ActionButtons editCharacter={editCharacter} deleteCharacter={deleteCharacter} character={character} setToast={setToast} /></TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <PopupToast toast={toast} closeToast={closeToast} />
            <CharacterModal open={editingCharacter} setOpen={setEditingCharacter} character={editingCharacter} setToast={setToast} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
