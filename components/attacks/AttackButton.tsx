import { GiPistolGun } from "react-icons/gi"
import TaxiAlertIcon from "@mui/icons-material/TaxiAlert"
import { ButtonGroup, Button } from "@mui/material"
import { useState } from "react"
import AttackModal from "./AttackModal"
import ChaseModal from "../chases/ChaseModal"

export default function AttackButton() {
  const [attackOpen, setAttackOpen] = useState<boolean>(false)
  const [attackAnchorEl, setAttackAnchorEl] = useState<Element | null>(null)
  const [chaseOpen, setChaseOpen] = useState<boolean>(false)
  const [chaseAnchorEl, setChaseAnchorEl] = useState<Element | null>(null)

  function openAttack(event: React.SyntheticEvent<Element, Event>) {
    setAttackAnchorEl(event.currentTarget)
    setAttackOpen(true)
  }

  function openChase(event: React.SyntheticEvent<Element, Event>) {
    setChaseAnchorEl(event.currentTarget)
    setChaseOpen(true)
  }

  return (
    <>
      <ButtonGroup>
        <Button
          variant="contained"
          color="error"
          startIcon={<GiPistolGun />}
          onClick={openAttack}
        />
        <Button
          variant="contained"
          color="error"
          startIcon={<TaxiAlertIcon />}
          onClick={openChase}
        />
      </ButtonGroup>
      <AttackModal open={attackOpen} setOpen={setAttackOpen} anchorEl={attackAnchorEl} setAnchorEl={setAttackAnchorEl} />
      <ChaseModal open={chaseOpen} setOpen={setChaseOpen} anchorEl={chaseAnchorEl} setAnchorEl={setChaseAnchorEl} />
    </>
  )
}
