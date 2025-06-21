import { colors, AvatarGroup, Avatar, Grid, Tooltip, Box, Paper, Button, ButtonGroup, Switch, FormControlLabel, Stack } from '@mui/material'
import { ButtonBar } from "@/components/StyledFields"
import CreateCharacter from '@/components/characters/CreateCharacter'
import SelectCharacter from '@/components/characters/SelectCharacter'
import CreateVehicle from '@/components/vehicles/CreateVehicle'
import GamemasterOnly from "@/components/GamemasterOnly"
import SelectParty from "@/components/parties/SelectParty"
import AttackButton from "@/components/attacks/AttackButton"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { Fight, Vehicle, Character } from "@/types/types"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import { useToast } from "@/contexts/ToastContext"
import { FightActions } from "@/reducers/fightState"
import CS from "@/services/CharacterService"
import FES from "@/services/FightEventService"
import { useEffect } from "react"
import FightViewers from "@/components/fights/FightViewers"

interface FightToolbarProps {
  showHidden: boolean
  setShowHidden: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FightToolbar({ showHidden, setShowHidden }: FightToolbarProps) {
  const { fight, dispatch } = useFight()
  const { saveLocally, getLocally } = useLocalStorage()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    const showHiddenShots = getLocally("showHiddenShots") || true
    setShowHidden(!!showHiddenShots)
  }, [getLocally, setShowHidden])

  const addCharacter = async (character: Character): Promise<void> => {
    try {
      if (CS.isCharacter(character)) {
        await client.addCharacter(fight, character as Character)
        await FES.addCharacter(client, fight, character as Character)
      } else {
        await client.addVehicle(fight, character as Vehicle)
        await FES.addVehicle(client, fight, character as Vehicle)
      }
      toastSuccess(`${character.name} added.`)
    } catch (error) {
      console.error(error)
      toastError()
    }
    dispatch({ type: FightActions.EDIT })
  }

  const show = () => {
    setShowHidden((prev) => !prev)
    saveLocally("showHiddenShots", showHidden)
  }

  if (!fight?.id) {
    return <></>
  }

  return (
    <ButtonBar>
      <Grid container alignItems="center">
        <Grid item>
          <Stack direction="row" spacing={2} alignItems="center">
            <GamemasterOnly user={user}>
              <Tooltip title={showHidden ? "Hide Hidden" : "Show Hidden"}>
                <Button variant="contained" color="primary" onClick={show}>
                  {showHidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Button>
              </Tooltip>
              <ButtonGroup>
                <CreateVehicle />
                <CreateCharacter />
              </ButtonGroup>
              <ButtonGroup>
                <SelectCharacter addCharacter={addCharacter} />
              </ButtonGroup>
              <ButtonGroup>
                <SelectParty />
              </ButtonGroup>
            </GamemasterOnly>
            <AttackButton />
          </Stack>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FightViewers />
        </Grid>
      </Grid>
    </ButtonBar>
  )
}
