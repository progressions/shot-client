import { Box, Button, FormControlLabel, Link, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import { useEffect, useReducer, useState } from "react"
import { useRouter } from 'next/router'

import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
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

export default function Characters(charactersResponse: CharactersResponse) {
  const { client, session, user } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(charactersReducer, initialCharactersState)
  const { edited, faction, archetype, characters, character_type, factions, search, showHidden } = state
  const meta = state?.meta || {}
  const router = useRouter()

  useEffect(() => {
    dispatch({ type: CharactersActions.CHARACTERS, payload: charactersResponse })
  }, [charactersResponse, dispatch])

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getCharactersAndVehicles({ faction_id: faction.id, archetype, search, character_type, show_all: showHidden, page: state?.page })
        dispatch({ type: CharactersActions.CHARACTERS, payload: data })
      } catch(error) {
        toastError()
      }
    }
    if (user && edited) {
      reload()
    }
  }, [edited, user, faction, archetype, client, dispatch, toastError, search, character_type, showHidden, state?.page])

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

  function loadPrevious() {
    if (!dispatch) return

    dispatch({ type: CharactersActions.PREVIOUS })
    const url = {
      pathname: router.pathname,
      query: { ...router.query, page: meta?.prev_page }
    }
    router.push(url, undefined, { shallow: true })
  }

  function loadNext() {
    if (!dispatch) return

    dispatch({ type: CharactersActions.NEXT })
    const url = {
      pathname: router.pathname,
      query: { ...router.query, page: meta?.next_page }
    }
    router.push(url, undefined, { shallow: true })
  }

  if (!characters) return <></>

  return (
    <>
      <Typography variant="h1" gutterBottom>Characters</Typography>
      <CharactersToolbar
        state={state}
        dispatch={dispatch}
        textSearch={true}
      />
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
              meta?.prev_page &&
              <TableRow>
                <TableCell colSpan={6}>
                  <Button sx={{width: "100%"}} onClick={loadPrevious} variant="contained" color="primary">Previous</Button>
                </TableCell>
              </TableRow>
            }
            {
              characters.map((character: Character) => (
                <CharacterDisplay key={character.id} character={character} user={user} />
              ))
            }
            {
              meta?.next_page &&
              <TableRow>
                <TableCell colSpan={6}>
                  <Button sx={{width: "100%"}} onClick={loadNext} variant="contained" color="primary">Next</Button>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
