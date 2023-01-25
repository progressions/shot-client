import { Tooltip, Button, Typography } from "@mui/material"
import ButtonBar from "../../ButtonBar"
import CreateSchtick from "./CreateSchtick"
import SchtickModal from "./SchtickModal"
import { useState } from "react"

export default function CreateSchtickButton({ setSchticks }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
      >
        New Schtick
      </Button>
      <CreateSchtick open={open} setOpen={setOpen} setSchticks={setSchticks} />
    </>
  )
}
