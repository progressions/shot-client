import type { Severity, Character, CharacterEffect, PopupProps, Effect } from "@/types/types"
import { IconButton, Box, Alert, AlertTitle, Typography, Stack } from "@mui/material"
import GamemasterOnly from "@/components/GamemasterOnly"
import { useFight, useToast, useClient, useCharacter } from "@/contexts"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import { FightActions } from "@/reducers/fightState"

export default function EffectPopup({
  id, data
}: PopupProps) {
  const { user, client } = useClient()
  const { character } = useCharacter()
  const { toastSuccess, toastError } = useToast()
  const { fight, dispatch } = useFight()

  const { severity, effects } = data

  const toolbarColor = `${severity}.dark`
  const actionValueLabel = (effect: CharacterEffect) => {
    if (effect.action_value === "MainAttack") {
      return "Attack"
    } else {
      return effect.action_value
    }
  }
  const deleteEffect = async (effect: CharacterEffect) => {
    try {
      await client.deleteCharacterEffect(effect, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`Effect ${effect.name} deleted.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  console.log("data", data)

  return (
    <Box sx={{width: 500}}>
      <Alert severity={severity as Severity} sx={{backgroundColor: "black", color: "white"}}>
        {
          effects.map((effect: CharacterEffect) => (<Box key={effect.id}>
            <Stack direction="row" spacing={2}>
              <AlertTitle>
                <Box sx={{width: 100}}>{effect.name}</Box>
              </AlertTitle>
              <GamemasterOnly user={user} character={character}>
                <IconButton onClick={async () => await deleteEffect(effect)}><DeleteIcon sx={{marginTop: -1, color: toolbarColor}} /></IconButton>
              </GamemasterOnly>
            </Stack>
            <Box mt={-1} pb={1}>
              <Typography variant="caption">{effect.description}</Typography>
              <Typography variant="subtitle1">{actionValueLabel(effect)} {effect.change}</Typography>
            </Box>
          </Box>))
        }
      </Alert>
    </Box>
  )
}
