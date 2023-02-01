import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "../StyledFields"
import WeaponModal from "./WeaponModal"
import { useState } from "react"
import type { WeaponsStateType, WeaponsActionType } from "./filterReducer"

interface CreateWeaponProps {
  filter: WeaponsStateType
  dispatchFilter: React.Dispatch<WeaponsActionType>
}

export default function CreateWeapon({ filter, dispatchFilter }: CreateWeaponProps) {
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
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Weapon"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <WeaponModal filter={filter} open={open} setOpen={setOpen} dispatchFilter={dispatchFilter} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}

