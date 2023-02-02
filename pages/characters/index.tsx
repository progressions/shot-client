import Head from "next/head"
import Layout from "../../components/Layout"
import Client from "../../components/Client"
import type { NextApiRequest, NextApiResponse } from "next"

import { useState } from "react"
import Router from "next/router"

import { Link, Paper, Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

import { authOptions } from "../api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

import { useSession } from "next-auth/react"

import { ButtonBar } from "../../components/StyledFields"
import ActionValues from "../../components/characters/ActionValues"
import ActionButtons from "../../components/characters/ActionButtons"
import CharacterModal from "../../components/characters/CharacterModal"
import VehicleModal from "../../components/vehicles/VehicleModal"
import AvatarBadge from "../../components/characters/AvatarBadge"
import CreateCharacter from "../../components/characters/CreateCharacter"
import CreateVehicle from "../../components/vehicles/CreateVehicle"
import CharacterFilters from "../../components/characters/CharacterFilters"
import GamemasterOnly from "../../components/GamemasterOnly"

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharactersProps {
  characters: Character[],
  jwt: string
}

const characterVisibility = (character: Character) => {
  return (character.active)
}

const fetchVehicles = async (client: Client) => {
  const response = await client.getAllVehicles()
  if (response.status === 200) {
    const vehicles = await response.json()
    const availableVehicles = vehicles.filter(characterVisibility)

    return [response, availableVehicles]
  } else {
    return [response, []]
  }
}

const fetchCharacters = async (client: Client) => {
  const response = await client.getAllCharacters()
  if (response.status === 200) {
    const chars = await response.json()
    const availableChars = chars.filter(characterVisibility)

    return [response, availableChars]
  } else {
    return [response, []]
  }
}

const fetchCharactersAndVehicles = async (client: Client) => {
  const [characterResponse, characters] = await fetchCharacters(client)
  const [vehicleResponse, vehicles] = await fetchVehicles(client)

  const allCharacters = characters.concat(vehicles).sort((a: Character, b: Character) => a.name.localeCompare(b.name))

  return [characterResponse, vehicleResponse, allCharacters]
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const session: any = await getServerSession(req as NextApiRequest, res as NextApiResponse, authOptions as any)
  const jwt = session?.authorization
  const client = new Client({ jwt })

  const campaignResponse = await client.getCurrentCampaign()
  const currentCampaign = campaignResponse.status === 200 ? await campaignResponse.json() : null
  const [characterResponse, vehicleResponse, allCharacters] = await fetchCharactersAndVehicles(client)

  if (!currentCampaign) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      },
      props: {
      }
    }
  }
  if ([characterResponse.status, vehicleResponse.status].includes(200)) {

    return {
      props: {
        characters: allCharacters,
        jwt: jwt
      }, // will be passed to the page component as props
    }
  }
  if ([characterResponse.status, vehicleResponse.status].includes(401)) {
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
  const { toastError, toastSuccess } = useToast()
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
      toastError()
    }
  }

  async function deleteCharacter(character: Character): Promise<void> {
    const response = await client.deleteCharacter(character)

    if (response.status === 200) {
      reloadCharacters()
    } else {
      toastError()
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

  return (
    <>
      <Head>
        <title>Characters - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Container maxWidth="lg">
            <Typography variant="h1" gutterBottom>Characters</Typography>
            <GamemasterOnly user={user}>
              <ButtonBar>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CharacterFilters filters={filters} setFilters={setFilters} />
                  <CreateCharacter reload={reloadCharacters} />
                  <CreateVehicle reload={reloadCharacters} />
                  <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
                </Stack>
              </ButtonBar>
            </GamemasterOnly>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Action Values</TableCell>
                    <TableCell>Creator</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    filteredCharacters(characters).map((character: Character) => {
                      return (<TableRow key={character.id}>
                        <TableCell sx={{width: 50}}>
                          <AvatarBadge character={character} user={user} />
                        </TableCell>
                        <TableCell sx={{width: 200}}>
                          <Typography variant="h5">
                            { character.category === "character" &&
                            <Link color="text.primary" href={`/characters/${character.id}`}>
                              {character.name}
                            </Link> }
                            { character.category === "vehicle" &&
                              character.name }
                          </Typography>
                        </TableCell>
                        <TableCell>{character.action_values["Type"]}</TableCell>
                        <TableCell><ActionValues character={character} /></TableCell>
                        <TableCell>{character.user?.first_name} {character.user?.last_name}</TableCell>
                      </TableRow>)
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Layout>
      </main>
    </>
  )
}
