import Head from "next/head"
import Layout from "../../components/Layout"
import Client from "../../components/Client"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerClient } from "../../utils/getServerClient"

import { useState } from "react"
import Router from "next/router"

import { Link, Paper, Switch, FormControlLabel, Stack, Avatar, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Container, Typography } from "@mui/material"

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
import type { PaginationMeta, AuthSession, Person, Vehicle, Character, CharacterFilter, ServerSideProps, Toast } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharactersProps {
  characters: Character[]
  meta: PaginationMeta
}

export async function getServerSideProps({ req, res }: ServerSideProps) {
  const { client } = await getServerClient(req, res)

  const campaignResponse = await client.getCurrentCampaign()
  const currentCampaign = campaignResponse.status === 200 ? await campaignResponse.json() : null

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
  const { characters, meta } = await client.getCharactersAndVehicles()

  return {
    props: {
      characters: characters,
      meta: meta,
    }, // will be passed to the page component as props
  }
}

export default function Characters({ characters:initialCharacters, meta }: CharactersProps) {
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
    try {
      const { characters, meta } = await client.getCharactersAndVehicles()
      setCharacters(characters)
    } catch(error) {
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
