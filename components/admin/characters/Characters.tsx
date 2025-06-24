import { Container, Pagination, Box, Button, FormControlLabel, Link, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import { useEffect, useReducer, useState } from "react"
import { useRouter } from 'next/router'

import { useClient, useToast } from "@/contexts"
import { Character, CharacterFilter, CharactersResponse, defaultCharacter, PaginationMeta } from "@/types/types"
import ActionValues from "@/components/characters/ActionValues"
import AvatarBadge from "@/components/characters/AvatarBadge"
import CharacterFilters from "@/components/characters/CharacterFilters"
import CreateCharacter from "@/components/characters/CreateCharacter"
import GamemasterOnly from "@/components/GamemasterOnly"
import { ButtonBar } from "@/components/StyledFields"
import CreateVehicle from "@/components/vehicles/CreateVehicle"
import CharactersToolbar from "@/components/admin/characters/CharactersToolbar"
import CharacterDisplay from "@/components/admin/characters/CharacterDisplay"
import { CharactersActions, initialCharactersState, charactersReducer } from "@/reducers/charactersState"

interface CharactersProps {
}

export default function Characters({}: CharactersProps) {
  const { client, session, user } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(charactersReducer, initialCharactersState)
  const { meta, loading, edited, faction, archetype, characters, character_type, factions, search, showHidden, page } = state
  const router = useRouter()

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getCharactersAndVehicles({
          faction_id: faction.id,
          archetype,
          search,
          character_type,
          show_all: showHidden,
          page: page
        })
        dispatch({ type: CharactersActions.CHARACTERS, payload: data })
      } catch(error) {
        toastError()
      }
    }
    if (user && edited) {
      reload()
    }
  }, [edited, user, faction, archetype, client, dispatch, toastError, search, character_type, showHidden, page])

  useEffect(() => {
    router.push(
      { pathname: router.pathname, query: { page: page } },
      undefined,
      { shallow: true }
    )
  }, [edited])

  function editCharacter(character: Character): void {
    dispatch({ type: CharactersActions.CHARACTER, payload: character })
  }

  async function deleteCharacter(character: Character): Promise<void> {
    try {
      await client.deleteCharacter(character)
      dispatch({ type: CharactersActions.EDIT })
    } catch(error) {
      toastError()
    }
  }

  const characterMatchesType = (character: Character): boolean => {
    if (character_type) {
      return character.action_values?.["Type"] === character_type
    } else {
      return true
    }
  }

  const characterMatchesName = (character: Character): boolean => {
    if (search) {
      return new RegExp(search, "gi").test(character.name)
    } else {
      return true
    }
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: CharactersActions.UPDATE, name: "page", value: value})
    router.push(
      { pathname: router.pathname, query: { page: value } },
      undefined,
      { shallow: true }
    )
  }

  if (!characters) return <></>

  return (
    <>
      <Container maxWidth="lg" sx={{paddingTop: 2, minWidth: 1000}}>
      <CharactersToolbar
        state={state}
        dispatch={dispatch}
        textSearch={true}
      />
      { edited && <Typography gutterBottom pt={5}>Loading characters...</Typography> }
      { !edited && (<>
        <Pagination sx={{mb: 1}} count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Archetype</TableCell>
                <TableCell>Faction</TableCell>
                <TableCell>Creator</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                characters.map((character: Character) => (
                  <CharacterDisplay key={character.id} character={character} user={user} />
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination sx={{mt: 1}} count={meta.total_pages} page={page} onChange={handlePageChange} variant="outlined" color="primary" shape="rounded" size="large" />
      </>) }
    </Container>
    </>
  )
}
