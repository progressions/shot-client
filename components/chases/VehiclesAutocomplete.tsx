import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useState, useEffect } from "react"
import type { Vehicle, InputParamsType } from "@/types/types"
import { defaultVehicle } from "@/types/types"

interface VehiclesAutocompleteParams {
  label?: string,
  vehicle: Vehicle,
  setVehicle: (vehicle: Vehicle) => void
  disabled: boolean
}

export default function VehiclesAutocomplete({ label, vehicle, setVehicle, disabled }: VehiclesAutocompleteParams) {
  const { fight} = useFight()
  const { client } = useClient()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getVehicles = async () => {
      const data = await client.getVehiclesInFight(fight)
      setVehicles(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getVehicles()
    }
  }, [client, fight])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Vehicle) {
    setVehicle(newValue || defaultVehicle)
  }

  function getOptionLabel(option: Vehicle) {
    if (option.location) {
      const location = option.location ? ` (${option.location})` : ""
      return `${option.name}${location}`
    }
    return option.name
  }

  const helperText = (vehicles.length) ? "": "There are no available targets."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultVehicle}
      value={vehicle || defaultVehicle}
      disabled={disabled}
      options={vehicles || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Vehicle, value: Vehicle) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label={label} sx={{width: "100%"}} />}
    />
  )
}
