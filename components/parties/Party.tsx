import { Avatar, CardMedia, DialogContent, Stack, IconButton, Box, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { StyledDialog } from "@/components/StyledFields"
import ImageDisplay from "@/components/images/ImageDisplay"

import type { PartiesStateType, PartiesActionType } from "@/reducers/partiesState"
import type { Character, Vehicle, Party as PartyType } from "@/types/types"
import { defaultParty } from "@/types/types"
import { PartiesActions } from "@/reducers/partiesState"

import PartyModal from "@/components/parties/PartyModal"
import Members from "@/components/parties/Members"
import PartyCardBase from "@/components/parties/PartyCardBase"
import PS from "@/services/PartyService"

import { useState } from "react"

interface PartyProps {
  party: PartyType
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function Party({ party, state, dispatch }: PartyProps) {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [open, setOpen] = useState<boolean>(false)

  async function deleteFunction() {
    try {
      if (party.characters.length > 0 || party.vehicles.length > 0) {
        const doit = confirm("Delete this party? It has members.")
        if (!doit) return
      }
      await client.deleteParty(party)
      dispatch({ type: PartiesActions.EDIT })
      toastSuccess("Party deleted")
    } catch (error) {
      toastError()
    }
  }

  async function removeCharacter(character: Character) {
    try {
      character.category === "vehicle" ?
        await client.removeVehicleFromParty(party, character as Vehicle) :
        await client.removeCharacterFromParty(party, character as Character)
      dispatch({ type: PartiesActions.EDIT })
      toastSuccess(`${character.name} removed.`)
    } catch (error) {
      toastError()
    }
  }

  function editFunction(event: React.MouseEvent<HTMLButtonElement>) {
    // dispatch({ type: PartiesActions.PARTY, payload: party })
    setOpen(true)
  }

  const handleClose = () => {
    dispatch({ type: PartiesActions.PARTY, payload: defaultParty })
    setOpen(false)
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
  if (party.faction?.name) {
    subheader += `Faction: ${party.faction.name} `
  }
  subheader += PS.rosterSummary(party)

  const avatar = party.image_url ? <ImageDisplay entity={party} /> : null

  const mediaUrl = party.image_url ? `${party.image_url}?w-300,h-300` : ""

  return (
    <>
      <PartyCardBase
        title={party.name}
        subheader={subheader}
        action={deleteButton}
        avatar={avatar}
      >
      { party.image_url && <CardMedia image={mediaUrl} title={party.name} sx={{padding: 2, height: 300}}/> }

        <Stack spacing={2}>
          <Typography>{party.description}</Typography>
          <Box>
            <Members party={party} removeCharacter={removeCharacter} />
          </Box>
        </Stack>
      </PartyCardBase>
      <StyledDialog
        open={open}
        onClose={handleClose}
        title="Party"
      >
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <PartyModal party={party} state={state} open={open} setOpen={setOpen} dispatch={dispatch} />
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
