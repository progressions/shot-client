import { Stack, FormControlLabel, Switch } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { CharacterFilter } from "@/types/types"
import CharacterFilters from "@/components/characters/CharacterFilters"
import CreateCharacter from "@/components/characters/CreateCharacter"
import GamemasterOnly from "@/components/GamemasterOnly"
import { ButtonBar } from "@/components/StyledFields"
import CreateVehicle from "@/components/vehicles/CreateVehicle"
import CharacterMenu from "@/components/characters/CharacterMenu"
import { CharactersStateType, CharactersActionType, CharactersActions } from "@/reducers/charactersState"

interface CharactersToolbarProps {
  state: CharactersStateType
  dispatch: React.Dispatch<CharactersActionType>
  textSearch?: boolean
}

export default function CharactersToolbar({ state, dispatch, textSearch }: CharactersToolbarProps) {
  const { client, session, user } = useClient()
  const { showHidden } = state

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: CharactersActions.UPDATE, name: "showHidden", value: checked })
  }

  return (
    <ButtonBar>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" width="100%">
        <Stack direction="row" spacing={2} alignItems="center">
          <CharacterFilters state={state} dispatch={dispatch} textSearch={textSearch} />
          <FormControlLabel label="Show Hidden" control={<Switch checked={showHidden} />} onChange={show} />
        </Stack>
        <CharacterMenu />
      </Stack>
    </ButtonBar>
  )
}
