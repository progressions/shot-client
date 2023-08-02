import { Stack, Box, TextField, MenuItem } from "@mui/material"

import type { Character, Archetype, Faction, InputParamsType } from "../../types/types"
import { CharactersStateType, CharactersActionType, CharactersActions } from "../../reducers/charactersState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "../StyledFields"
import { CharacterTypes, defaultFaction } from "../../types/types"

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
        <Box sx={{width: 155}}>
          <StyledSelect fullWidth name="character_type" label="Character Type" select value={character_type} onChange={handleChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value={CharacterTypes.PC}>{CharacterTypes.PC}</MenuItem>
            <MenuItem value={CharacterTypes.Ally}>{CharacterTypes.Ally}</MenuItem>
            <MenuItem value={CharacterTypes.Mook}>{CharacterTypes.Mook}</MenuItem>
            <MenuItem value={CharacterTypes.FeaturedFoe}>{CharacterTypes.FeaturedFoe}</MenuItem>
            <MenuItem value={CharacterTypes.Boss}>{CharacterTypes.Boss}</MenuItem>
            <MenuItem value={CharacterTypes.UberBoss}>{CharacterTypes.UberBoss}</MenuItem>
          </StyledSelect>
        </Box>
        <Box sx={{width: 155}}>
          <StyledSelect
            fullWidth
            name="faction"
            label="Faction"
            select
            value={faction.id}
            onChange={handleChange}
          >
            <MenuItem key="" value="">All</MenuItem>
            {
              factions.map((faction: Faction) => <MenuItem key={faction.id} value={faction.id}>{faction.name}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <Box sx={{width: 155}}>
          <StyledSelect fullWidth name="archetype" label="Archetype" select value={archetype} onChange={handleChange}>
            <MenuItem key="" value="">All</MenuItem>
            {
              archetypes.map((archetype: Archetype) => <MenuItem key={archetype} value={archetype}>{archetype}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <Box sx={{width: 155}}>
          <StyledAutocomplete
            disabled={loading}
            freeSolo
            options={characters}
            sx={{ width: 155 }}
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
