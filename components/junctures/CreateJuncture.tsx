import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "@/components/StyledFields"
import JunctureModal from "@/components/junctures/JunctureModal"
import { useState } from "react"
import type { JuncturesStateType, JuncturesActionType } from "@/reducers/juncturesState"

interface CreateJunctureProps {
  state: JuncturesStateType
  dispatch: React.Dispatch<JuncturesActionType>
}

export default function CreateJuncture({ state, dispatch }: CreateJunctureProps) {
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
        title="Juncture"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <JunctureModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
