import { Tooltip, Button, Typography } from "@mui/material"
import ButtonBar from "../ButtonBar"
import CreateSchtick from "./CreateSchtick"
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
      <CreateSchtick filter={filter} open={open} setOpen={setOpen} dispatchFilter={dispatchFilter} />
    </>
  )
}
