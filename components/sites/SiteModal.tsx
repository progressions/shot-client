import { StyledAutocomplete, StyledSelect, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { FormControlLabel, Switch, createFilterOptions, MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"

import GamemasterOnly from "@/components/GamemasterOnly"
import type { Vehicle, FilterParamsType, OptionType, InputParamsType, Character, Site } from "@/types/types"
import { defaultFaction, defaultSite } from "@/types/types"
import { useState, useEffect, useReducer } from "react"
import type { SitesStateType, SitesActionType } from "@/reducers/sitesState"
import { SitesActions } from "@/reducers/sitesState"
import Faction from "@/components/characters/edit/Faction"
import CharacterFilters from "@/components/characters/CharacterFilters"
import SelectCharacter from "@/components/characters/SelectCharacter"
import ImageManager from "@/components/images/ImageManager"
import Editor from "@/components/editor/Editor"

interface SiteModalProps {
  state: SitesStateType
  dispatch: React.Dispatch<SitesActionType>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  site?: Site
}

export default function SiteModal({ state, dispatch, open, setOpen, site:initialSite }: SiteModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client, user } = useClient()
  const { loading } = state
  const [site, setSite] = useState<Site>(initialSite || defaultSite)

  async function updateSite(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()
    dispatch({ type: SitesActions.SAVING })

    try {
      await addNewCharacters().catch((error) => {
        console.error("Error adding new characters:", error)
        toastError("Failed to add new characters.")
      })
      const data = site?.id ?
        await client.updateSite(site as Site) :
        await client.createSite(site as Site)
      dispatch({ type: SitesActions.EDIT })
      setOpen(false)
      toastSuccess(`${site.name} ${site?.id ? "updated" : "added"}.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: SitesActions.RESET })
  }

  async function addNewCharacters() {
    if (!site?.characters || !initialSite?.characters) return

    const newCharacters = site?.characters?.filter(
      (character) => !initialSite?.characters?.some((c) => c.id === character.id)
    )

    for (const character of newCharacters) {
      await client.addCharacterToSite(site as Site, character as Character)
    }
  }

  async function deleteImage(site: Site) {
    await client.deleteSiteImage(site as Site)
  }

  function cancelForm() {
    setSite(defaultSite)
    dispatch({ type: SitesActions.RESET })
    setOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSite({
      ...site,
      [event.target.name]: event.target.value
    })
  }

  const handleCheck = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: SitesActions.UPDATE, name: "secret", value: checked })
  }

  const addCharacter = async (character: Character):Promise<void> => {
    try {
      setSite((prevSite) => ({
        ...prevSite,
        characters: [...(prevSite.characters || []), { id: character.id, name: character.name, image_url: character.image_url } as Character]
      }))

      toastSuccess(`${character.name} added.`)
    } catch(error) {
      toastError()
    }
  }

  return (
    <>
      <GamemasterOnly user={user}>
        <FormControlLabel label="Hidden" name="secret" control={<Switch checked={site.secret} />} onChange={handleCheck} />
      </GamemasterOnly>
      <Stack spacing={2} direction="row">
        <Stack spacing={1} sx={{width: 550, maxWidth: 550}}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledTextField
              sx={{width: 600}}
              required
              autoFocus
              value={site?.name || ""}
              name="name"
              label="Name"
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>
          <Editor name="description" value={site?.description || ""} onChange={handleChange} />
          <Faction faction={site.faction || defaultFaction} onChange={handleChange} width={600} />
          { site?.id && <SelectCharacter addCharacter={addCharacter} /> }
          { !!site?.characters?.length && (
            <>
              <Box sx={{py: 2, mb: 2}}>
                <Stack direction="column" spacing={1}>
              {site.characters.map((character, index) => (
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
            <SaveButton disabled={loading} onClick={updateSite}>{ site?.id ? "Save" : "Add" }</SaveButton>
          </Stack>
        </Stack>
        { site?.id && <ImageManager name="site" entity={site} updateEntity={updateSite} deleteImage={deleteImage} apiEndpoint="allSites" /> }
      </Stack>
    </>
  )
}
