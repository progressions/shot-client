import { GiPistolGun } from "react-icons/gi"
import TaxiAlertIcon from "@mui/icons-material/TaxiAlert"
import { ButtonGroup, Button } from "@mui/material"
import { useState } from "react"
import AttackModal from "@/components/attacks/AttackModal"
import ChaseModal from "@/components/chases/ChaseModal"
import { useFight } from "@/contexts"
import { FightActions } from "@/reducers/fightState"

export default function AttackButton() {
  const { state, dispatch } = useFight()

  function toggleAttack(event: React.SyntheticEvent<Element, Event>) {
    dispatch({ type: FightActions.UPDATE, name: "attacking", value: !state.attacking })
    dispatch({ type: FightActions.UPDATE, name: "chasing", value: false })
  }

  function openChase(event: React.SyntheticEvent<Element, Event>) {
    dispatch({ type: FightActions.UPDATE, name: "chasing", value: !state.chasing })
    dispatch({ type: FightActions.UPDATE, name: "attacking", value: false })
  }

  return (
    <>
      <ButtonGroup>
        <Button
          variant="contained"
          color="error"
          startIcon={<GiPistolGun />}
          onClick={toggleAttack}
        />
        <Button
          variant="contained"
          color="error"
          startIcon={<TaxiAlertIcon />}
          onClick={openChase}
        />
      </ButtonGroup>
    </>
  )
}
