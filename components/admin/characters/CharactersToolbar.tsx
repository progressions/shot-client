import { Stack, FormControlLabel, Switch } from "@mui/material"
import { useClient } from "../../../contexts/ClientContext"
import { CharacterFilter } from "../../../types/types"
import CharacterFilters from "../../characters/CharacterFilters"
import CreateCharacter from "../../characters/CreateCharacter"
import GamemasterOnly from "../../GamemasterOnly"
import { ButtonBar } from "../../StyledFields"
import CreateVehicle from "../../vehicles/CreateVehicle"

interface CharactersToolbarProps {
  filters: CharacterFilter
  setFilters: React.Dispatch<React.SetStateAction<CharacterFilter>>
  reload: () => Promise<void>
  showHidden: boolean
  show: (event: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

export default function CharactersToolbar({ filters, setFilters, reload, showHidden, show }: CharactersToolbarProps) {
  const { client, session, user } = useClient()

  return (
    <GamemasterOnly user={user}>
      <ButtonBar>
        <Stack direction="row" spacing={2} alignItems="center">
          <CharacterFilters filters={filters} setFilters={setFilters} />
          <CreateCharacter reload={reload} />
          <CreateVehicle reload={reload} />
          <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
        </Stack>
      </ButtonBar>
    </GamemasterOnly>
  )
}
