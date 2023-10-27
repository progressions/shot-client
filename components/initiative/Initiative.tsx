import { FightActions } from "@/reducers/fightState"
import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { SaveCancelButtons, StyledTextField, StyledDialog } from "@/components/StyledFields"
import { Button, DialogContent, Stack, Box, Typography } from "@mui/material"
import { useState } from "react"
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
  const { fight, dispatch } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const defaultValues:InitiativeCharacters = {}
  const [values, setValues] = useState<InitiativeCharacters>(defaultValues)
  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)

  function handleClick() {
    setProcessing(true)
    setOpen(true)
  }

  function handleClose() {
    setValues(defaultValues)
    setOpen(false)
    setProcessing(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const eligibleCharacters:InitPenalty[] = Object.keys(values).map((key) => {
      return values[key] as InitPenalty
    })

    await Promise.all(eligibleCharacters.map(([character, initiative]: InitPenalty) => {
      return updateInitiative(character as Character, parseInt(initiative))
    }))

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

  return (<>
    <Button variant="contained" color="secondary" endIcon={<PlayArrowIcon />} disabled={processing} onClick={handleClick}>PCs</Button>
    <StyledDialog
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Initiative"
    >
      <DialogContent>
        <Typography>Ask each player to roll Initiative, enter the values below. They should use the Acceleration of their vehicle if they are driving, and Speed if they are not.</Typography>
        <Stack spacing={2}>
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
                    sx={{width: 110}}
                  />
                  <Typography variant="h5" color="error" sx={{width: 20}}>{combatant.current_shot}</Typography>
                  <Typography variant="h5" sx={{width: 400}}>{combatant.name}</Typography>
                </Stack>
              )
            })
          }
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <SaveCancelButtons
            onSubmit={() => { alert("submit") }}
            onCancel={handleClose}
          />
        </Stack>
      </DialogContent>
    </StyledDialog>
  </>)
}
