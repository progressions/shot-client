import { StyledDialog, StyledTextField } from "@/components/StyledFields"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import BoltIcon from '@mui/icons-material/Bolt'
import { Button, DialogContent, Stack, Box } from "@mui/material"
import { ChaseActions, initialChaseState, chaseReducer } from "@/reducers/chaseState"
import { FightActions } from "@/reducers/fightState"
import { useFight } from "@/contexts/FightContext"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import VS from "@/services/VehicleService"
import AS from "@/services/ActionService"
import { useEffect, useReducer } from "react"
import type { Fight, Vehicle } from "@/types/types"
import { defaultVehicle, CharacterTypes } from "@/types/types"
import SwerveButton from "@/components/attacks/SwerveButton"
import ResultsDisplay from "@/components/chases/ResultsDisplay"
import VehiclesAutocomplete from "@/components/chases/VehiclesAutocomplete"
import Attacker from "@/components/chases/Attacker"
import Target from "@/components/chases/Target"
import FightService from "@/services/FightService"
import FES from "@/services/FightEventService"

interface ChaseModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  anchorEl: Element | null
  setAnchorEl: React.Dispatch<React.SetStateAction<Element | null>>
}

export default function ChaseModal({ open, setOpen, anchorEl, setAnchorEl }: ChaseModalProps) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [state, dispatch] = useReducer(chaseReducer, initialChaseState)
  const { success, mookResults, count, smackdown, chasePoints, position,
    conditionPoints, method, typedSwerve, target, attacker, shots, edited } = state

  useEffect(() => {
    dispatch({ type: ChaseActions.RESET })

    const firstUp = FightService.firstUp(fight)
    if (firstUp && VS.isVehicle(firstUp)) {
      dispatch({ type: ChaseActions.UPDATE, payload: { fight: fight } })
      setAttacker(firstUp)
    }
  }, [fight, open])

  useEffect(() => {
    if (VS.isType(attacker, [CharacterTypes.Boss, CharacterTypes.UberBoss])) {
      dispatch({ type: ChaseActions.UPDATE, payload: { shots: 2 } })
    } else {
      dispatch({ type: ChaseActions.UPDATE, payload: { shots: 3 } })
    }
  }, [attacker])

  function handleClose() {
    setOpen(false)
    setAnchorEl(null)
  }

  function setAttacker(vehicle: Vehicle) {
    if (vehicle?.id) {
      dispatch({ type: ChaseActions.ATTACKER, payload: { attacker: vehicle } })
    } else {
      dispatch({ type: ChaseActions.ATTACKER, payload: { attacker: defaultVehicle } })
    }
  }

  function setTarget(vehicle: Vehicle) {
    const defense = VS.defense(vehicle)
    dispatch({ type: ChaseActions.TARGET, payload: { target: vehicle } })
  }

  function resetAttack() {
    dispatch({ type: ChaseActions.UPDATE, payload: { edited: false, typedSwerve: "" } })
  }

  async function applyChasePoints() {
    try {
      if (attacker.driver?.id) {
        await client.actCharacter(attacker.driver, fight as Fight, shots)
      }
      await Promise.all([
        client.updateVehicle(target, fight),
        client.updateVehicle(attacker, fight),
        FES.chaseAttack(client, fight, attacker, target, chasePoints || 0, conditionPoints || 0, method, shots)
      ])

      dispatchFight({ type: FightActions.EDIT })
      if (!!chasePoints || !!conditionPoints) {
        toastSuccess(`${target.name} took ${chasePoints} Chase Points and ${conditionPoints} Condition Points. ${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      } else {
        toastSuccess(`${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      }
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  async function killMooks() {
    try {
      await client.updateVehicle(target, fight)
      await client.updateVehicle(attacker, fight)
      await FES.chaseMooks(client, fight, attacker, target, count, method, shots)

      dispatchFight({ type: FightActions.EDIT })
      if (!!count) {
        toastSuccess(`${attacker.name} killed ${count} ${target.name} ${count == 1 ? "mook" : "mooks"} and spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      } else {
        toastSuccess(`${attacker.name} spent ${shots} ${shots == 1 ? "Shot" : "Shots"}.`)
      }
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  function handleSwerve(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({ type: ChaseActions.UPDATE, payload: { typedSwerve: value } })
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    dispatch({ type: ChaseActions.UPDATE, payload: { [name]: value } })
  }

  function handleCheck(event: React.SyntheticEvent<Element, Event>, checked: boolean) {
    dispatch({ type: ChaseActions.UPDATE, payload: { stunt: checked } })
  }

  function handleAttack() {
    if (typedSwerve == "" || typedSwerve == null) {
      const swerve = AS.swerve()
      dispatch({ type: ChaseActions.UPDATE, payload: { swerve, typedSwerve: "" } })
    }
    dispatch({ type: ChaseActions.EDIT })
  }

  return (
    <>
      <StyledDialog
        open={open}
        onClose={handleClose}
        title="Chase"
        width="lg"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "600px",  // Set your width here
            },
          },
        }}
      >
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: 700 }}>
                <VehiclesAutocomplete
                  label="Attacker"
                  vehicle={attacker}
                  setVehicle={setAttacker}
                  disabled={edited}
                />
              </Box>
              <StyledTextField autoFocus type="number" label="Shots" required name="shots" value={shots || ''} onChange={handleChange} />
            </Stack>
            <Attacker
              state={state}
              setAttacker={setAttacker}
              handleChange={handleChange}
              handleCheck={handleCheck}
            />
            <VehiclesAutocomplete
              label="Target"
              vehicle={target}
              setVehicle={setTarget}
              disabled={edited}
            />
            <Target
              state={state}
              setTarget={setTarget}
              handleChange={handleChange}
            />
            <SwerveButton
              state={state}
              handleSwerve={handleSwerve}
              handleAttack={handleAttack}
            />
            { edited && <ResultsDisplay state={state} handleClose={handleClose} /> }
            { success && edited && !!target?.id && !VS.isMook(target) && !VS.isMook(attacker) && !!chasePoints && <>
              <Button
                sx={{width: 200}}
                endIcon={<HeartBrokenIcon />}
                variant="contained"
                color="error"
                onClick={applyChasePoints}
              >
                Apply Results
              </Button>
            </>}
            { edited && !success && <>
              <Button sx={{width: 200}} endIcon={<BoltIcon />} variant="contained" color="error" onClick={applyChasePoints}>Apply</Button>
            </> }
            { edited && !!target?.id && VS.isMook(target) && success && <>
              <Button sx={{width: 200}} endIcon={<PersonOffIcon />} variant="contained" color="error" onClick={killMooks}>Kill Mooks</Button>
            </> }
            { edited && <Button onClick={resetAttack} variant="contained" color="primary">Reset</Button> }
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
