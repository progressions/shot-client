import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import type { InputParamsType, Vehicle, Character } from "@/types/types"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useState, useEffect } from "react"
import { defaultCharacter } from "@/types/types"

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
    const getCharacters = async () => {
      const data = await client.getCharactersInFight(fight)
      setDrivers(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getCharacters()
    }
  }, [client, fight, vehicle?.action_values])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Character) {
    onChange(newValue)
  }

  function getOptionLabel(option: Character) {
    if (option.id) {
      const location = option.location ? ` (${option.location})` : ""
      return `${option.name}${location}`
    }
    return ""
  }

  const helperText = (drivers.length) ? "": "There are no available drivers."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultCharacter}
      value={vehicle?.driver?.id ? vehicle.driver : defaultCharacter}
      disabled={loading}
      options={drivers || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Character, value: Character) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Driver" sx={{width: 500}} />}
    />
  )
}
