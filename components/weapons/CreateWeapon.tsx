import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "@/components/StyledFields"
import WeaponModal from "@/components/weapons/WeaponModal"
import { useState } from "react"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"

interface CreateWeaponProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
}

export default function CreateWeapon({ state, dispatch }: CreateWeaponProps) {
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
            <WeaponModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}

