import { Stack, DialogContent, Tooltip, Button, Typography } from "@mui/material"
import { StyledDialog, ButtonBar } from "@/components/StyledFields"
import SiteModal from "@/components/sites/SiteModal"
import { useState } from "react"
import type { SitesStateType, SitesActionType } from "@/reducers/sitesState"

interface CreateSiteProps {
  state: SitesStateType
  dispatch: React.Dispatch<SitesActionType>
}

export default function CreateSite({ state, dispatch }: CreateSiteProps) {
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
        title="Site"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <SiteModal state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
