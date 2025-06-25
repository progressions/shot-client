import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "@/components/StyledFields"
import PartyModal from "@/components/parties/PartyModal"
import { useState } from "react"
import type { PartiesStateType, PartiesActionType } from "@/reducers/partiesState"
import { PartiesActions } from "@/reducers/partiesState"

interface CreatePartyProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function CreateParty({ state, dispatch }: CreatePartyProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    console.log("Closing party modal")
    dispatch({ type: PartiesActions.UPDATE, name: "search", value: "" })
    setOpen(false)
  }

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
        onClose={handleClose}
        title="Party"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <PartyModal newParty={true} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
