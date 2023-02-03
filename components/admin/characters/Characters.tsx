import { FormControlLabel, Link, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

import { useState } from "react"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { Character, CharacterFilter, defaultCharacter, PaginationMeta } from "../../../types/types"
import ActionValues from "../../characters/ActionValues"
import AvatarBadge from "../../characters/AvatarBadge"
import CharacterFilters from "../../characters/CharacterFilters"
import CreateCharacter from "../../characters/CreateCharacter"
import GamemasterOnly from "../../GamemasterOnly"
import { ButtonBar } from "../../StyledFields"
import CreateVehicle from "../../vehicles/CreateVehicle"
import CharactersToolbar from "./CharactersToolbar"
import CharacterDisplay from "./CharacterDisplay"

interface CharactersProps {
  characters: Character[]
  meta: PaginationMeta
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
  return (
    <>
      <Typography variant="h1" gutterBottom>Characters</Typography>
      <CharactersToolbar
        filters={filters}
        setFilters={setFilters}
        reload={reloadCharacters}
        showHidden={showHidden}
        show={show}
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
