import Head from "next/head"
import Layout from "../components/Layout"
import Client from "../components/Client"

import { useState } from "react"
import Router from "next/router"

import { Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

import { useSession } from "next-auth/react"

import ActionValues from "../components/characters/ActionValues"
import ActionButtons from "../components/characters/ActionButtons"
import CharacterModal from "../components/characters/CharacterModal"
import VehicleModal from "../components/vehicles/VehicleModal"
import AvatarBadge from "../components/characters/AvatarBadge"
import CreateCharacter from "../components/characters/CreateCharacter"
import CharacterFilters from "../components/characters/CharacterFilters"
import GamemasterOnly from "../components/GamemasterOnly"

import { useToast } from "../contexts/ToastContext"
import { useClient } from "../contexts/ClientContext"
import type { Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast } from "../types/types"
import { defaultCharacter } from "../types/types"

interface CharactersProps {
  characters: Character[],
  jwt: string
}

const characterVisibility = (character: Character) => {
  return (character.active)
}

const fetchVehicles = async (client: any) => {
  const response = await client.getAllVehicles()
  const vehicles = await response.json()

  const availableVehicles = vehicles.filter(characterVisibility)

  return [response, availableVehicles]
}

const fetchCharacters = async (client: any) => {
  const response = await client.getAllCharacters()
  const chars = await response.json()
  const availableChars = chars.filter(characterVisibility)

  return [response, availableChars]
}

const fetchCharactersAndVehicles = async (client: any) => {
  const [characterResponse, characters] = await fetchCharacters(client)
  const [vehicleResponse, vehicles] = await fetchVehicles(client)

  const allCharacters = characters.concat(vehicles).sort((a: Character, b: Character) => a.name.localeCompare(b.name))

  return [characterResponse, vehicleResponse, allCharacters]
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const session: any = await unstable_getServerSession(req as any, res as any, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt })

  const [characterResponse, vehicleResponse, allCharacters] = await fetchCharactersAndVehicles(client)

  if (characterResponse.status === 200 && vehicleResponse === 200) {
    return {
      props: {
        characters: allCharacters,
        jwt: jwt
      }, // will be passed to the page component as props
    }
  }
  if (characterResponse.status === 401 || vehicleResponse === 401) {
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
  const { client, session, user } = useClient()
  const [editingCharacter, setEditingCharacter] = useState<Character>(defaultCharacter)
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [filters, setFilters] = useState<CharacterFilter>({
    type: null,
    name: null
  })
  const { setToast } = useToast()
  const [showHidden, setShowHidden] = useState<boolean>(false)

  function editCharacter(character: Character): void {
    setEditingCharacter(character)
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }

  async function reloadCharacters() {
  const [characterResponse, vehicleResponse, allCharacters] = await fetchCharactersAndVehicles(client)

    if (characterResponse.status === 200 && vehicleResponse.status === 200) {
      setCharacters(allCharacters)
    } else {
      setToast({ open: true, message: "There was an error.", severity: "error" })
    }
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteCharacter(character)

    if (response.status === 200) {
      reloadCharacters()
    } else {
      setToast({ open: true, message: "There was an error.", severity: "error" })
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

  const characterVisibility = (character: Character): boolean => {
    return (showHidden || character.active)
  }

  const filteredCharacters = (characters: Character[]): Character[] => {
    return characters
      .filter(characterVisibility)
      .filter(characterMatchesType)
      .filter(characterMatchesName)
  }

  if (session?.status !== "authenticated") {
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
            <GamemasterOnly user={user}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CharacterFilters filters={filters} setFilters={setFilters} />
                <CreateCharacter />
                <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
              </Stack>
            </GamemasterOnly>
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
                          <AvatarBadge character={character} user={user} />
                        </TableCell>
                        <TableCell sx={{fontWeight: "bold"}}><Typography variant="h5">{character.name}</Typography></TableCell>
                        <TableCell><ActionValues character={character} /></TableCell>
                        <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
                        <TableCell><ActionButtons editCharacter={editCharacter} deleteCharacter={deleteCharacter} character={character} /></TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <CharacterModal open={editingCharacter} setOpen={setEditingCharacter} character={editingCharacter as Person} reloadCharacters={reloadCharacters} />
            <VehicleModal open={editingCharacter as Vehicle} setOpen={setEditingCharacter as any} character={editingCharacter as Vehicle} reloadCharacters={reloadCharacters} />
          </Container>
        </Layout>
      </main>
    </>
  )
}
