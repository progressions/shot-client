import { Stack, FormControlLabel, Switch } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { CharacterFilter } from "@/types/types"
import CharacterFilters from "@/components/characters/CharacterFilters"
import CreateCharacter from "@/components/characters/CreateCharacter"
import GamemasterOnly from "@/components/GamemasterOnly"
import { ButtonBar } from "@/components/StyledFields"
import CreateVehicle from "@/components/vehicles/CreateVehicle"
import { CharactersStateType, CharactersActionType, CharactersActions } from "@/reducers/charactersState"

interface CharactersToolbarProps {
  state: CharactersStateType
  dispatch: React.Dispatch<CharactersActionType>
}

export default function CharactersToolbar({ state, dispatch }: CharactersToolbarProps) {
  const { client, session, user } = useClient()
  const { showHidden } = state

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: CharactersActions.UPDATE, name: "showHidden", value: checked })
  }

  return (
    <GamemasterOnly user={user}>
      <ButtonBar>
        <Stack direction="row" spacing={2} alignItems="center">
          <CharacterFilters state={state} dispatch={dispatch} />
          <CreateCharacter />
          <CreateVehicle />
          <FormControlLabel label="All" control={<Switch checked={showHidden} />} onChange={show} />
        </Stack>
      </ButtonBar>
    </GamemasterOnly>
  )
}
