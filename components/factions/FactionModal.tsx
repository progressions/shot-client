import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"

import GamemasterOnly from "@/components/GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Faction as FactionType } from "@/types/types"
import { defaultFaction } from "@/types/types"
import { useState, useEffect, useReducer } from "react"
import type { FactionsStateType, FactionsActionType } from "@/reducers/factionsState"
import { FactionsActions } from "@/reducers/factionsState"
import Faction from "@/components/characters/edit/Faction"
import CharacterFilters from "@/components/characters/CharacterFilters"
import SelectCharacter from "@/components/characters/SelectCharacter"
import ImageManager from "@/components/images/ImageManager"
import Editor from "@/components/editor/Editor"

interface FactionModalProps {
  state: FactionsStateType
  dispatch: React.Dispatch<FactionsActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  faction?: FactionType
}

export default function FactionModal({ state, dispatch, open, setOpen, faction:initialFaction }: FactionModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client, user } = useClient()
  const { loading } = state
  const [faction, setFaction] = useState<FactionType>(initialFaction || defaultFaction)

  async function updateFaction(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    dispatch({ type: FactionsActions.SAVING })

    try {
      await addNewCharacters().catch((error) => {
        console.error("Error adding new characters:", error)
        toastError("Failed to add new characters.")
      })
      const data = faction?.id ?
        await client.updateFaction(faction as FactionType) :
        await client.createFaction(faction as FactionType)
      dispatch({ type: FactionsActions.EDIT })
      setOpen(false)
      toastSuccess(`${faction.name} ${faction?.id ? "updated" : "added"}.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: FactionsActions.RESET })
  }

  async function addNewCharacters() {
    if (!faction?.characters || !initialFaction?.characters) return

    const newCharacters = faction?.characters?.filter(
      (character) => !initialFaction?.characters?.some((c) => c.id === character.id)
    )

    for (const character of newCharacters) {
      await client.updateCharacter({ ...character, faction_id: faction.id } as Character)
    }
  }

  async function deleteImage(faction: FactionType) {
    await client.deleteFactionImage(faction as FactionType)
  }

  function cancelForm() {
    setFaction(defaultFaction)
    dispatch({ type: FactionsActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFaction({
      ...faction,
      [event.target.name]: event.target.value
    })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: FactionsActions.UPDATE, name: "secret", value: checked })
  }

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      setFaction((prevFaction) => ({
        ...prevFaction,
        characters: [...(prevFaction.characters || []), { id: character.id, name: character.name, image_url: character.image_url } as Character]
      }))

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      toastError()
    }
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <Stack spacing={1} sx={{width: 600, maxWidth: 600}}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 600}}
              required
              autoFocus
              value={faction?.name || ""}
              name="name"
              label="Name"
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>
          <Editor name="description" value={faction?.description || ""} onChange={handleChange} />
          { faction?.id && <SelectCharacter addCharacter={addCharacter} /> }
          { !!faction?.characters?.length && (
            <>
              <Box sx={{py: 2, mb: 2}}>
                <Stack direction="column" spacing={1}>
              {faction.characters.map((character, index) => (
                <Stack direction="row" spacing={1} key={character.id} alignItems="center">
                  <CharacterAvatar key={character.id} character={character} />
                  <Typography>
                    {character.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            </Box>
            </>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelButton disabled={loading} onClick={cancelForm} />
            <SaveButton disabled={loading} onClick={updateFaction}>{ faction?.id ? "Save" : "Add" }</SaveButton>
          </Stack>
        </Stack>
        { faction?.id && <ImageManager name="faction" entity={faction} updateEntity={updateFaction} deleteImage={deleteImage} apiEndpoint="allFactions" /> }
      </Stack>
    </>
  )
}
