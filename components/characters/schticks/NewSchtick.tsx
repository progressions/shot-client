import { Tooltip, Button, Typography } from "@mui/material"
import SchtickCardBase from "./SchtickCardBase"
import SchtickModal from "./SchtickModal"

import { useState } from "react"

export default function NewSchtick({ characterState, dispatchCharacter }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SchtickCardBase
        title="New Schtick"
      >
        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "capitalize",
            height: 120,
            width: 245,
            align: "center"
          }}
        >
          New Schtick
        </Button>
      </SchtickCardBase>
      <SchtickModal open={open} setOpen={setOpen} />
    </>
  )
}
