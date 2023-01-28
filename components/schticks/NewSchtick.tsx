import { Tooltip, Button, Typography } from "@mui/material"
import SchtickCardBase from "./SchtickCardBase"
import SchtickModal from "./SchtickModal"
import { useCharacter } from "../../contexts/CharacterContext"

import { useState } from "react"

export default function NewSchtick({ setSchticks }: any) {
  const [open, setOpen] = useState(false)
  const { state } = useCharacter()
  const contextPresent = (!!state.character)

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
      { !contextPresent && <SchtickModal open={open} setOpen={setOpen} setSchticks={setSchticks} /> }
    </>
  )
}
