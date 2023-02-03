import { FormControlLabel, Link, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

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
import { CharactersActions, initialCharactersState, charactersReducer } from "./charactersState"

export default function Characters(charactersResponse: CharactersResponse) {
  const { client, session, user } = useClient()
  const { toastError, toastSuccess } = useToast()
  const [state, dispatch] = useReducer(charactersReducer, initialCharactersState)
  const { faction, archetype, characters, character_type, factions, search, showHidden } = state

  useEffect(() => {
    dispatch({ type: CharactersActions.CHARACTERS, payload: charactersResponse })
  }, [charactersResponse, dispatch])

  useEffect(() => {
    const reload = async () => {
      try {
        const data = await client.getCharactersAndVehicles({ faction, archetype })
        dispatch({ type: CharactersActions.CHARACTERS, payload: data })
      } catch(error) {
        toastError()
      }
    }
    if (user) {
      reload().catch(() => toastError())
    }
  }, [user, faction, archetype, client, dispatch, toastError])

  function editCharacter(character: Character): void {
    dispatch({ type: CharactersActions.CHARACTER, payload: character })
  }

  async function reloadCharacters() {
    try {
      const data = await client.getCharactersAndVehicles({ faction, archetype })
      dispatch({ type: CharactersActions.CHARACTERS, payload: data })
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

  const characterVisibility = (character: Character): boolean => {
    return (showHidden || character.active)
  }

  const filteredCharacters = (characters: Character[]): Character[] => {
    return characters
      .filter(characterVisibility)
      .filter(characterMatchesType)
      .filter(characterMatchesName)
  }

  if (!characters) return <></>

  return (
    <>
      <Typography variant="h1" gutterBottom>Characters</Typography>
      <CharactersToolbar
        state={state}
        dispatch={dispatch}
        reload={reloadCharacters}
      />
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
              filteredCharacters(characters).map((character: Character) => (
                <CharacterDisplay key={character.id} character={character} user={user} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
