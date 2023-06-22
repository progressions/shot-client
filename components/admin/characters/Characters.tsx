import { Box, Button, FormControlLabel, Link, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import { useEffect, useReducer, useState } from "react"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { Character, CharacterFilter, CharactersResponse, defaultCharacter, PaginationMeta } from "../../../types/types"
import ActionValues from "../../characters/ActionValues"
import AvatarBadge from "../../characters/AvatarBadge"
import CharacterFilters from "../../characters/CharacterFilters"
import CreateCharacter from "../../characters/CreateCharacter"
import GamemasterOnly from "../../GamemasterOnly"
import { ButtonBar } from "../../StyledFields"
import CreateVehicle from "../../vehicles/CreateVehicle"
import CharactersToolbar from "./CharactersToolbar"
import CharacterDisplay from "./CharacterDisplay"
import { CharactersActions, initialCharactersState, charactersReducer } from "../../../reducers/charactersState"

export default function Characters(charactersResponse: CharactersResponse) {
  const { client, session, user } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(charactersReducer, initialCharactersState)
  const { edited, faction, archetype, characters, character_type, factions, search, showHidden } = state
  const meta = state?.meta || {}

  useEffect(() => {
    dispatch({ type: CharactersActions.CHARACTERS, payload: charactersResponse })
  }, [charactersResponse, dispatch])

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getCharactersAndVehicles({ faction, archetype, search, character_type, show_all: showHidden, page: state?.page })
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
  }

  function loadNext() {
    if (!dispatch) return

    dispatch({ type: CharactersActions.NEXT })
  }

  if (!characters) return <></>

  return (
    <>
      <Typography variant="h1" gutterBottom>Characters</Typography>
      <CharactersToolbar
        state={state}
        dispatch={dispatch}
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
