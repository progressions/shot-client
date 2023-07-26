import React from "react"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken'
import { Button, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { FightActions } from "../../reducers/fightState"
import type { AttackRoll, Character, ActionValues } from "../../types/types"
import type { MookRollValue } from "./MookRolls"
import CS from "../../services/CharacterService"
import AS from "../../services/ActionService"

interface SmackdownsParams {
  enemy: Character
  attackRolls: AttackRoll[]
  value: MookRollValue
  handleClose: () => void
}

export default function Smackdowns({ enemy, attackRolls, value, handleClose }: SmackdownsParams) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { fight, dispatch } = useFight()


  return (<>
    </>
  )
}
