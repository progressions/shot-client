import { Avatar, CardMedia, DialogContent, Stack, IconButton, Box, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Member from "@/components/sites/Member"
import SiteCardBase from "@/components/sites/SiteCardBase"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { StyledDialog } from "@/components/StyledFields"
import RichTextRenderer from "@/utils/RichTextRenderer"

import type { SitesStateType, SitesActionType } from "@/reducers/sitesState"
import type { Character, Vehicle, Site as SiteType } from "@/types/types"
import { SitesActions } from "@/reducers/sitesState"
import SiteModal from "@/components/sites/SiteModal"
import ImageDisplay from "@/components/images/ImageDisplay"

import { useState } from "react"

interface SiteProps {
  site: SiteType
  state: SitesStateType
  dispatch: React.Dispatch<SitesActionType>
}

export default function Site({ site, state, dispatch }: SiteProps) {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { site:editingSite } = state
  const [open, setOpen] = useState<boolean>(false)

  async function deleteFunction() {
    try {
      if (site?.characters?.length) {
        const doit = confirm("Delete this site? It has members.")
        if (!doit) return
      }
      await client.deleteSite(site)
      dispatch({ type: SitesActions.EDIT })
      toastSuccess("Site deleted")
    } catch (error) {
      toastError()
    }
  }

  async function removeCharacter(character: Character | Vehicle) {
    try {
      await client.removeCharacterFromSite(site, character as Character)
      dispatch({ type: SitesActions.EDIT })
      toastSuccess(`${character.name} removed.`)
    } catch (error) {
      toastError()
    }
  }

  function editFunction(event: React.MouseEvent<HTMLButtonElement>) {
    setOpen(true)
  }

  const deleteButton = (<>
    <IconButton key="delete" onClick={deleteFunction}>
      <ClearIcon />
    </IconButton>
    <IconButton key="edit" onClick={editFunction}>
      <EditIcon />
    </IconButton>
  </>)

  let subheader = ""
  if (site.faction?.name) {
    subheader += `Faction: ${site.faction.name} `
  }
  subheader += `(${site?.characters?.length} characters)`

  function generateKey(character: Character | Vehicle, index: number): string {
    return `${character.id}-${index}`
  }

  const avatar = site.image_url ? <ImageDisplay entity={site} /> : null
  const image_url = site.image_url ? `${site.image_url}?tr=w-600,h-300,c-maintain_ratio` : null

  return (
    <>
      <SiteCardBase
        site={site}
        title={site.name}
        subheader={subheader}
        action={deleteButton}
        avatar={avatar}
      >
        { site.image_url &&
          <CardMedia image={image_url || ""} sx={{height: 500, mb: 2}} />
        }
        <RichTextRenderer html={site.description} />
      </SiteCardBase>
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Site"
        width={850}
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <SiteModal site={site} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
