import { StyledAutocomplete, StyledSelect } from "../../StyledFields"
import { useFight } from "../../../contexts/FightContext"
import { useClient } from "../../../contexts/ClientContext"
import { useState, useEffect } from "react"
import type { Vehicle, InputParamsType } from "../../../types/types"
import { defaultVehicle } from "../../../types/types"

interface EnemiesAutocompleteParams {
  enemy: Vehicle,
  setEnemy: React.Dispatch<React.SetStateAction<Vehicle>>
}

export default function EnemiesAutocomplete({ enemy, setEnemy }: EnemiesAutocompleteParams) {
  const { fight} = useFight()
  const { client } = useClient()
  const [enemies, setEnemies] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setEnemy(defaultVehicle)
  }, [setEnemy])

  useEffect(() => {
    const getVehicles = async () => {
      const data = await client.getVehiclesInFight(fight)
      setEnemies(data)
      setLoading(false)
    }

    if (fight?.id && client) {
      getVehicles()
    }
  }, [client, fight])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Vehicle) {
    setEnemy(newValue || defaultVehicle)
  }

  function getOptionLabel(option: Vehicle) {
    if (option.driver?.id) {
      return `${option.name} (${option.driver.name})`
    }
    return option.name
  }

  const helperText = (enemies.length) ? "": "There are no available targets."

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={defaultVehicle}
      value={enemy || defaultVehicle}
      disabled={loading}
      options={enemies || []}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Vehicle, value: Vehicle) => option.id == value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Target" sx={{width: 500}} />}
    />
  )
}
