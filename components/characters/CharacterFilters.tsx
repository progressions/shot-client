import { Stack, Box, TextField, MenuItem } from "@mui/material"

import type { Character, Archetype, FactionName, InputParamsType } from "../../types/types"
import { CharactersStateType, CharactersActionType, CharactersActions } from "../../reducers/charactersState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "../StyledFields"

interface CharacterFiltersProps {
  state: CharactersStateType,
  dispatch: React.Dispatch<CharactersActionType>
}

export default function CharacterFilters({ state, dispatch }: CharacterFiltersProps) {
  const { loading, character, characters, character_type, faction, factions, archetype, archetypes, search } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: CharactersActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const selectCharacter = (event: React.ChangeEvent<HTMLInputElement>, value: Character) => {
    dispatch({ type: CharactersActions.CHARACTER, payload: value })
  }

  const getOptionLabel = (character: Character) => {
    if (!character.name) return ""

    const carEmoji = "🚗"
    const personEmoji = "👤"

    const emoji = (character.category === "vehicle") ? carEmoji : personEmoji

    return `${emoji} ${character.name} (${character.action_values["Type"]})`
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box sx={{width: 180}}>
          <StyledSelect fullWidth name="character_type" label="Character Type" select value={character_type} onChange={handleChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="PC">Player Character</MenuItem>
            <MenuItem value="Ally">Ally</MenuItem>
            <MenuItem value="Mook">Mook</MenuItem>
            <MenuItem value="Featured Foe">Featured Foe</MenuItem>
            <MenuItem value="Boss">Boss</MenuItem>
            <MenuItem value="Uber-Boss">Uber-Boss</MenuItem>
          </StyledSelect>
        </Box>
        <Box sx={{width: 180}}>
          <StyledSelect fullWidth name="faction" label="Faction" select value={faction} onChange={handleChange}>
            <MenuItem key="" value="">All</MenuItem>
            {
              factions.map((faction: FactionName) => <MenuItem key={faction} value={faction}>{faction}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <Box sx={{width: 180}}>
          <StyledSelect fullWidth name="archetype" label="Archetype" select value={archetype} onChange={handleChange}>
            <MenuItem key="" value="">All</MenuItem>
            {
              archetypes.map((archetype: Archetype) => <MenuItem key={archetype} value={archetype}>{archetype}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <Box sx={{width: 180}}>
          <StyledAutocomplete
            disabled={loading}
            freeSolo
            options={characters}
            sx={{ width: 180 }}
            value={character}
            onChange={selectCharacter}
            getOptionLabel={getOptionLabel}
            renderInput={(params: InputParamsType) => <StyledTextField autoFocus {...params} label="Character" />}
          />
        </Box>
      </Stack>
    </>
  )
}
