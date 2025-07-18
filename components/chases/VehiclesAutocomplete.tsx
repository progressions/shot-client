import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { useFight } from "@/contexts"
import { useState, useEffect } from "react"
import type { Vehicle, InputParamsType } from "@/types/types"
import { defaultVehicle } from "@/types/types"
import FS from "@/services/FightService"

interface VehiclesAutocompleteParams {
  label?: string,
  vehicle: Vehicle
  setVehicle: (vehicle: Vehicle) => void
  disabled: boolean
  excludeVehicles?: Vehicle[]
}

export default function VehiclesAutocomplete({ label, vehicle, setVehicle, disabled, excludeVehicles }: VehiclesAutocompleteParams) {
  const { fight} = useFight()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const data = FS.vehiclesInFight(fight).filter(c => !excludeVehicles?.some(exclude => exclude.id === c.id))
    setVehicles(data)
    setLoading(false)
  }, [fight, excludeVehicles])

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
