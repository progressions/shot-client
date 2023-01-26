import { Tooltip, Button, Typography } from "@mui/material"
import ButtonBar from "../../ButtonBar"
import CreateSchtick from "./CreateSchtick"
import { useState } from "react"

export default function CreateSchtickButton({ dispatchFilter }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          color="primary"
        >
          New Schtick
        </Button>
      </Typography>
      <CreateSchtick open={open} setOpen={setOpen} dispatchFilter={dispatchFilter} />
    </>
  )
}
