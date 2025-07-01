import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "@/components/StyledFields"
import FactionModal from "@/components/factions/FactionModal"
import { useState } from "react"
import type { FactionsStateType, FactionsActionType } from "@/reducers/factionsState"

interface CreateFactionProps {
  state: FactionsStateType
  dispatch: React.Dispatch<FactionsActionType>
}

export default function CreateFaction({ state, dispatch }: CreateFactionProps) {
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
        title="Faction"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <FactionModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
