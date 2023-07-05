import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "../StyledFields"
import PartyModal from "./PartyModal"
import { useState } from "react"
import type { PartiesStateType, PartiesActionType } from "../../reducers/partiesState"

interface CreatePartyProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function CreateParty({ state, dispatch }: CreatePartyProps) {
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
        title="Party"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <PartyModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
