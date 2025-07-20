import { FightActions } from "@/reducers/fightState"
import { useFight, useToast, useClient } from "@/contexts"
import { SaveCancelButtons, StyledTextField } from "@/components/StyledFields"
import { Paper, colors, Button, DialogContent, Stack, Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FS from "@/services/FightService"
import CS from "@/services/CharacterService"
import VS from "@/services/VehicleService"
import type { Vehicle, Character, Fight } from "@/types/types"

type InitPenalty = [Character | Vehicle, string]

interface InitiativeCharacters {
  [key: string]: InitPenalty
}

export default function Initiative() {
  const { fight, state, dispatch } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()
  const { initiative } = state

  const defaultValues:InitiativeCharacters = {}
  const [values, setValues] = useState<InitiativeCharacters>(defaultValues)
  const [saving, setSaving] = useState(false)
  const [savable, setSavable] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const hasValues = Object.values(values).some(([_, initiative]) => initiative !== "")
    setSavable(hasValues)
  }, [values])

  function handleClick() {
    dispatch({ type: FightActions.INITIATIVE, payload: !initiative })
  }

  function handleClose() {
    setValues(defaultValues)
    setSaving(false)
    dispatch({ type: FightActions.INITIATIVE, payload: false })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setSaving(true)
    event.preventDefault()

    const eligibleCharacters:InitPenalty[] = Object.keys(values).map((key) => {
      return values[key] as InitPenalty
    })

    await Promise.all(eligibleCharacters.map(([character, initiative]: InitPenalty) => {
      return updateInitiative(character as Character, parseInt(initiative))
    }))
    await client.touchFight(fight)

    toastSuccess("Initiative updated.")
    dispatch({ type: FightActions.EDIT })
    handleClose()
  }

  async function updateInitiative(character: Character | Vehicle, initiative: number) {
    if (CS.isCharacter(character)) {
      const updatedCharacter = CS.setInitiative(character, initiative)
      await client.updateCharacter(updatedCharacter, fight)
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>, combatant: Character | Vehicle) {
    const key = `${combatant.category},${combatant.shot_id}`
    setValues(prevValues => ({ ...prevValues, [key]: [combatant, event.target.value]}))
  }

  const combatants = FS.playerCharactersForInitiative(fight)

  if (!initiative) return
  if (!combatants.length) {
    return (
      <DialogContent>
        <Typography mb={3}>No characters available for Initiative.</Typography>
      </DialogContent>
    )
  }

  return (<>
  <Box component="form" onSubmit={handleSubmit} sx={{width: "100%"}}>
    <Paper sx={{ p: 2, ml: 2, my: 2, backgroundColor: colors.blueGrey[300], color: colors.blueGrey[900] }}>
      <Typography mb={3}>Ask each player to roll Initiative, enter the values below. They should use the Acceleration of their vehicle if they are driving, and Speed if they are not.</Typography>
      <Stack spacing={2} mb={3}>
        {
          combatants.map((combatant) => {
            if (VS.isVehicle(combatant)) return null
            const key = `${combatant.category},${combatant.shot_id}`
            return (
              <Stack key={key} direction="row" spacing={2} alignItems="center">
                <StyledTextField
                  name="initiative"
                  value={(values[key] && values[key][1]) || ""}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleChange(event, combatant) }}
                  label="Initiative"
                  type="number"
                  disabled={saving}
                  sx={{width: 110}}
                />
                <Typography variant="h5" color="error" sx={{width: 20}}>{combatant.current_shot}</Typography>
                <Typography variant="h5">{combatant.name}</Typography>
                { !combatant.driving?.id && <Typography sx={{color: colors.blueGrey[700], fontSize: "1rem"}}>Speed {CS.speed(combatant)}</Typography> }
                { combatant.driving?.id && <Typography sx={{color: colors.blueGrey[700], fontSize: "1rem"}}>Acc {VS.speed(combatant.driving)}</Typography> }
              </Stack>
            )
          })
        }
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <SaveCancelButtons
          disabled={saving || !savable}
          onCancel={handleClose}
        />
      </Stack>
    </Paper>
  </Box>
  </>)
}
