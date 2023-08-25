import { StyledDialog } from "../StyledFields"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import { Button, DialogContent, Stack } from "@mui/material"
import { ChaseActions, initialChaseState, chaseReducer } from "../../reducers/chaseState"
import { FightActions } from "../../reducers/fightState"
import { useFight } from "../../contexts/FightContext"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import VS from "../../services/VehicleService"
import AS from "../../services/ActionService"
import { useEffect, useReducer } from "react"
import VehiclesAutocomplete from "./VehiclesAutocomplete"
import Attacker from "./Attacker"
import Target from "./Target"
import type { Vehicle } from "../../types/types"
import { defaultVehicle } from "../../types/types"
import SwerveButton from "../attacks/SwerveButton"
import ResultsDisplay from "./ResultsDisplay"
import FightService from "../../services/FightService"

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
    conditionPoints, method, typedSwerve, target, attacker, edited } = state

  useEffect(() => {
    dispatch({ type: ChaseActions.RESET })

    const firstUp = FightService.firstUp(fight)
    if (firstUp && VS.isVehicle(firstUp)) {
      dispatch({ type: ChaseActions.UPDATE, payload: { fight: fight } })
      setAttacker(firstUp)
    }
  }, [open])

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
    if (!smackdown) return

    try {
      await client.updateVehicle(target, fight)
      await client.updateVehicle(attacker, fight)

      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${target.name} took ${chasePoints} Chase Points and ${conditionPoints} Condition Points.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    handleClose()
  }

  async function killMooks() {
    if (!count) return

    try {
      await client.updateVehicle(target, fight)
      await client.updateVehicle(attacker, fight)

      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${attacker.name} killed ${count} ${count == 1 ? "mook" : "mooks"}.`)
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
            <VehiclesAutocomplete
              label="Attacker"
              vehicle={attacker}
              setVehicle={setAttacker}
              disabled={edited}
            />
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
