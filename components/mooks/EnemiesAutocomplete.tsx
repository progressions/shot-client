import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useState, useEffect } from "react"
import type { Character, InputParamsType } from "../../types/types"
import { defaultCharacter } from "../../types/types"

interface EnemiesAutocompleteParams {
  enemy: Character,
  setEnemy: React.Dispatch<React.SetStateAction<Character>>
}

export default function EnemiesAutocomplete({ enemy, setEnemy }: EnemiesAutocompleteParams) {
  const { fight} = useFight()
  const { client } = useClient()
  const [enemies, setEnemies] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setEnemy(defaultCharacter)
  }, [setEnemy])

  useEffect(() => {
    const getCharacters = async () => {
      const data = await client.getCharactersInFight(fight, { type: ["PC", "Ally"] })
      setEnemies(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getCharacters()
    }
  }, [client, fight])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Character) {
    setEnemy(newValue || defaultCharacter)
  }

  function getOptionLabel(option: Character) {
    if (option.location) {
      const location = option.location ? ` (${option.location})` : ""
      return `${option.name}${location}`
    }
    return option.name
  }

  const helperText = (enemies.length) ? "": "There are no available targets."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultCharacter}
      value={enemy || defaultCharacter}
      disabled={loading}
      options={enemies || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Character, value: Character) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Target" sx={{width: 500}} />}
    />
  )
}
