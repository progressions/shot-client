import { Paper, colors, Button, DialogContent, Stack, Box } from "@mui/material"
import { StyledDialog, StyledTextField } from "@/components/StyledFields"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import BoltIcon from '@mui/icons-material/Bolt'

import { ChaseActions, initialChaseState, chaseReducer } from "@/reducers/chaseState"
import { FightActions } from "@/reducers/fightState"
import { useFight, useClient, useToast } from "@/contexts"
import VS from "@/services/VehicleService"
import AS from "@/services/ActionService"
import FES from "@/services/FightEventService"
import FS from "@/services/FightService"

import { useEffect, useReducer } from "react"

import type { Fight, Vehicle } from "@/types/types"
import { defaultVehicle, CharacterTypes } from "@/types/types"
import SwerveButton from "@/components/attacks/SwerveButton"
import ResultsDisplay from "@/components/chases/ResultsDisplay"
import VehiclesAutocomplete from "@/components/chases/VehiclesAutocomplete"
import Attacker from "@/components/chases/Attacker"
import Target from "@/components/chases/Target"

interface ChaseModalProps {
}

export default function ChaseModal({ }: ChaseModalProps) {
  const { fight, dispatch:dispatchFight } = useFight()
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [state, dispatch] = useReducer(chaseReducer, initialChaseState)
  const { success, mookResults, count, smackdown, chasePoints, position,
    conditionPoints, method, typedSwerve, target, attacker, shots, edited } = state

  useEffect(() => {
    dispatch({ type: ChaseActions.RESET })

    const firstUp = FS.firstUp(fight)
    if (firstUp && VS.isVehicle(firstUp)) {
      dispatch({ type: ChaseActions.UPDATE, payload: { fight: fight } })
      setAttacker(firstUp)
    }
  }, [fight])

  useEffect(() => {
    if (VS.isType(attacker, [CharacterTypes.Boss, CharacterTypes.UberBoss])) {
      dispatch({ type: ChaseActions.UPDATE, payload: { shots: 2 } })
    } else {
      dispatch({ type: ChaseActions.UPDATE, payload: { shots: 3 } })
    }
  }, [attacker])

  function handleClose() {
    dispatchFight({ type: FightActions.UPDATE, name: "chasing", value: false })
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
      <Paper sx={{ p: 2, mb: 2, backgroundColor: colors.blueGrey[300] }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="top">
            <Box sx={{width: "50%", mb: 2}}>
              <Stack direction="row" spacing={2}>
                <Box sx={{ width: 700, height: 70, pb: 2 }}>
                  <VehiclesAutocomplete
                    label="Attacker"
                    vehicle={attacker}
                    setVehicle={setAttacker}
                    disabled={edited}
                  />
                </Box>
                <StyledTextField type="number" label="Shots" required name="shots" value={shots || ''} onChange={handleChange} />
              </Stack>
              <Attacker
                state={state}
                setAttacker={setAttacker}
                handleChange={handleChange}
                handleCheck={handleCheck}
              />
            </Box>
            <Box sx={{width: "48%", mb: 2}}>
              <Box sx={{ width: "100%", height: 70, pb: 2 }}>
                <VehiclesAutocomplete
                  label="Target"
                  vehicle={target}
                  setVehicle={setTarget}
                  disabled={edited}
                />
              </Box>
              <Target
                state={state}
                setTarget={setTarget}
                handleChange={handleChange}
              />
            </Box>
          </Stack>
          <Box sx={{ alignSelf: "center", mb: 2 }}>
            <SwerveButton
              state={state}
              handleSwerve={handleSwerve}
              handleAttack={handleAttack}
            />
          </Box>
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
      </Paper>
    </>
  )
}
