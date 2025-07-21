import { Avatar, CardMedia, DialogContent, Stack, IconButton, Box, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Member from "@/components/junctures/Member"
import JunctureCardBase from "@/components/junctures/JunctureCardBase"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { StyledDialog } from "@/components/StyledFields"
import RichTextRenderer from "@/components/editor/RichTextRenderer"

import type { JuncturesStateType, JuncturesActionType } from "@/reducers/juncturesState"
import type { Character, Vehicle, Juncture as JunctureType } from "@/types/types"
import { JuncturesActions } from "@/reducers/juncturesState"
import JunctureModal from "@/components/junctures/JunctureModal"
import ImageDisplay from "@/components/images/ImageDisplay"

import { useState } from "react"

interface JunctureProps {
  juncture: JunctureType
  state: JuncturesStateType
  dispatch: React.Dispatch<JuncturesActionType>
}

export default function Juncture({ juncture, state, dispatch }: JunctureProps) {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { juncture:editingJuncture } = state
  const [open, setOpen] = useState<boolean>(false)

  async function deleteFunction() {
    try {
      if (juncture?.characters?.length) {
        const doit = confirm("Delete this juncture? It has members.")
        if (!doit) return
      }
      await client.deleteJuncture(juncture)
      dispatch({ type: JuncturesActions.EDIT })
      toastSuccess("Juncture deleted")
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
  if (juncture.faction?.name) {
    subheader += `Faction: ${juncture.faction.name} `
  }
  subheader += `(${juncture?.characters?.length} characters)`

  function generateKey(character: Character | Vehicle, index: number): string {
    return `${character.id}-${index}`
  }

  const avatar = juncture.image_url ? <ImageDisplay entity={juncture} /> : null
  const image_url = juncture.image_url ? `${juncture.image_url}?tr=w-600,h-300,c-maintain_ratio` : null

  return (
    <>
      <JunctureCardBase
        juncture={juncture}
        title={juncture.name}
        subheader={subheader}
        action={deleteButton}
        avatar={avatar}
      >
        { juncture.image_url &&
          <CardMedia image={image_url || ""} sx={{height: 500, mb: 2}} />
        }
        <RichTextRenderer key={juncture.description} html={juncture.description} />
      </JunctureCardBase>
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Juncture"
        width={850}
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <JunctureModal juncture={juncture} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
