import { Tooltip, Button, Typography } from "@mui/material"
import { ButtonBar } from "../StyledFields"
import WeaponModal from "./WeaponModal"
import { useState } from "react"

export default function CreateWeaponButton({ filter, dispatchFilter }: any) {
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
      <WeaponModal filter={filter} open={open} setOpen={setOpen} dispatchFilter={dispatchFilter} />
    </>
  )
}

