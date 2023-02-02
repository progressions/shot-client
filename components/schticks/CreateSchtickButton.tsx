import { Tooltip, Button, Typography } from "@mui/material"
import { ButtonBar } from "../StyledFields"
import SchtickModal from "./SchtickModal"
import { useState } from "react"
import type { SchticksStateType, SchticksActionType } from "./filterReducer"

interface CreateSchtickButtonProps {
  filter: SchticksStateType
  dispatchFilter: React.Dispatch<SchticksActionType>
}

export default function CreateSchtickButton({ filter, dispatchFilter }: CreateSchtickButtonProps) {
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
      <SchtickModal filter={filter} open={open} setOpen={setOpen} dispatchFilter={dispatchFilter} />
    </>
  )
}
