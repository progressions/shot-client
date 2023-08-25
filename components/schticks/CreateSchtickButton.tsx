import { Tooltip, Button, Typography } from "@mui/material"
import { ButtonBar } from "@/components/StyledFields"
import SchtickModal from "@/components/schticks/SchtickModal"
import { useState } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

interface CreateSchtickButtonProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function CreateSchtickButton({ state, dispatch }: CreateSchtickButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="primary"
        >
          New
        </Button>
      </Typography>
      <SchtickModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
    </>
  )
}
