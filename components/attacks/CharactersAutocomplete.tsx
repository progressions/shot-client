import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useState, useEffect } from "react"
import type { Character, InputParamsType } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface CharactersAutocompleteParams {
  label?: string,
  character: Character,
  setCharacter: (character: Character) => void
  disabled: boolean
}

export default function CharactersAutocomplete({ label, character, setCharacter, disabled }: CharactersAutocompleteParams) {
  const { fight} = useFight()
  const { client } = useClient()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getCharacters = async () => {
      const data = await client.getCharactersInFight(fight)
      setCharacters(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getCharacters()
    }
  }, [client, fight])

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
