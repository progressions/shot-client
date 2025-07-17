import { Typography } from "@mui/material"
import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { useFight } from "@/contexts"
import { useState, useEffect } from "react"
import { defaultCharacter, Character, type InputParamsType } from "@/types/types"
import FS from "@/services/FightService"

interface CharactersAutocompleteParams {
  label?: string
  character: Character
  setCharacter: (character: Character) => void
  disabled: boolean
  excludeCharacters?: Character[]
}

export default function CharactersAutocomplete({ label, character, setCharacter, disabled, excludeCharacters }: CharactersAutocompleteParams) {
  const { fight } = useFight()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const data = FS.charactersInFight(fight).filter(c => !excludeCharacters?.some(exclude => exclude.id === c.id))
    setCharacters(data)
    setLoading(false)
  }, [fight, excludeCharacters])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Character) {
    setCharacter(newValue || defaultCharacter)
  }

  function getOptionLabel(option: Character) {
    if (option.location) {
      const location = option.location ? ` (${option.location})` : ""
      return `${option.name}${location}`
    }
    return option.name
  }

  const helperText = (characters.length) ? "": "There are no available targets."

  if (loading) {
    return <Typography variant="body2" color="textSecondary">Loading characters...</Typography>
  }
  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultCharacter}
      value={character || defaultCharacter}
      disabled={disabled}
      options={characters || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Character, value: Character) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label={label} sx={{width: "100%"}} />}
    />
  )
}
