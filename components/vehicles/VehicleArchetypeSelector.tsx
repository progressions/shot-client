import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useState, useEffect } from "react"
import type { InputParamsType, Vehicle, Character, VehicleArchetype } from "@/types/types"
import { defaultCharacter } from "@/types/types"

import { Typography } from "@mui/material"

interface VehicleArchetypeSelectorProps {
  vehicle: Vehicle | null
  onChange: (archetype: VehicleArchetype) => void
}

export default function VehicleArchetypeSelector({ vehicle, onChange }: VehicleArchetypeSelectorProps) {
  const { fight } = useFight()
  const { client } = useClient()
  const [archetypes, setArchetypes] = useState<VehicleArchetype[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [archetype, setArchetype] = useState<VehicleArchetype | null>(null)

  console.log(archetypes)

  useEffect(() => {
    const getArchetypes = async () => {
      const data = await client.getVehicleArchetypes()
      setArchetypes(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      setLoading(true)
      getArchetypes()
    }
  }, [client, fight, vehicle?.action_values])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: VehicleArchetype) {
    onChange(newValue)
  }

  function getOptionLabel(option: Character) {
    if (option.name) {
      return `${option.name}`
    }
    return ""
  }

  const helperText = (archetypes.length) ? "": "There are no available vehicles."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultCharacter}
      value={archetype}
      disabled={loading}
      options={archetypes || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Character, value: Character) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Vehicle" sx={{width: 500}} />}
    />
  )
}
