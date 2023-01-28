import { Tooltip, Button, Typography } from "@mui/material"
import ButtonBar from "../ButtonBar"
import SchtickModal from "./SchtickModal"
import { useState } from "react"

export default function CreateSchtickButton({ filter, dispatchFilter }: any) {
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
