import { Tooltip, Button, Typography } from "@mui/material"
import { ButtonBar } from "../StyledFields"
import SchtickModal from "./SchtickModal"
import { useState } from "react"
import type { SchticksStateType, SchticksActionType } from "../../reducers/schticksState"

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
