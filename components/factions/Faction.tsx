import { Avatar, CardMedia, DialogContent, Stack, IconButton, Box, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Member from "@/components/factions/Member"
import FactionCardBase from "@/components/factions/FactionCardBase"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import { StyledDialog } from "@/components/StyledFields"
import RichTextRenderer from "@/components/editor/RichTextRenderer"

import type { FactionsStateType, FactionsActionType } from "@/reducers/factionsState"
import type { Character, Vehicle, Faction as FactionType } from "@/types/types"
import { FactionsActions } from "@/reducers/factionsState"
import FactionModal from "@/components/factions/FactionModal"
import ImageDisplay from "@/components/images/ImageDisplay"

import { useState } from "react"

interface FactionProps {
  faction: FactionType
  state: FactionsStateType
  dispatch: React.Dispatch<FactionsActionType>
}

export default function Faction({ faction, state, dispatch }: FactionProps) {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { faction:editingFaction } = state
  const [open, setOpen] = useState<boolean>(false)

  async function deleteFunction() {
    try {
      if (faction?.characters?.length) {
        const doit = confirm("Delete this faction? It has members.")
        if (!doit) return
      }
      await client.deleteFaction(faction)
      dispatch({ type: FactionsActions.EDIT })
      toastSuccess("Faction deleted")
    } catch (error) {
      toastError()
    }
  }

  async function removeCharacter(character: Character | Vehicle) {
    try {
      await client.updateCharacter({ ...character, faction_id: null })
      dispatch({ type: FactionsActions.EDIT })
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
  subheader += `(${faction?.characters?.length} characters)`

  function generateKey(character: Character | Vehicle, index: number): string {
    return `${character.id}-${index}`
  }

  const avatar = faction.image_url ? <ImageDisplay entity={faction} /> : null
  const image_url = faction.image_url ? `${faction.image_url}?tr=w-600,h-300,c-maintain_ratio` : null

  return (
    <>
      <FactionCardBase
        faction={faction}
        title={faction.name}
        subheader={subheader}
        action={deleteButton}
        avatar={avatar}
      >
        { faction.image_url &&
          <CardMedia image={image_url || ""} sx={{height: 500, mb: 2}} />
        }
        <RichTextRenderer key={faction.description} html={faction.description} />
      </FactionCardBase>
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Faction"
        width={850}
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <FactionModal faction={faction} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
