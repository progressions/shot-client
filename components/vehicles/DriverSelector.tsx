import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { Vehicle, Character } from "../../types/types"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useState, useEffect } from "react"
import { defaultCharacter } from "../../types/types"

interface DriverSelectorProps {
  vehicle: Vehicle | null
  onChange: (driver: Character) => void
}
export default function DriverSelector({ vehicle, onChange }: DriverSelectorProps) {
  const { fight } = useFight()
  const { client } = useClient()
  const [drivers, setDrivers] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (vehicle?.driver?.id) {
      onChange(vehicle.driver)
    }
  }, [vehicle.driver])

  useEffect(() => {
    const getCharacters = async () => {
      const data = await client.getCharactersInFight(fight)
      setDrivers(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getCharacters()
    }
  }, [client, fight])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Character) {
    onChange(newValue || defaultCharacter)
  }

  function getOptionLabel(option: Character) {
    if (option.id) {
      return option.name
    }
    return ""
  }

  const helperText = (drivers.length) ? "": "There are no available drivers."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultCharacter}
      value={vehicle.driver?.id ? vehicle.driver : defaultCharacter}
      disabled={loading}
      options={drivers || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Character, value: Character) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Driver" sx={{width: 500}} />}
    />
  )
}
