import { Avatar, CardMedia, DialogContent, Stack, IconButton, Box, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Member from "@/components/parties/Member"
import PartyCardBase from "@/components/parties/PartyCardBase"
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { StyledDialog } from "@/components/StyledFields"
import ImageDisplay from "@/components/images/ImageDisplay"

import type { PartiesStateType, PartiesActionType } from "@/reducers/partiesState"
import type { Character, Vehicle, Party as PartyType } from "@/types/types"
import { PartiesActions } from "@/reducers/partiesState"
import PartyModal from "@/components/parties/PartyModal"
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
  const { party:editingParty } = state
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

  async function removeCharacter(character: Character | Vehicle) {
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
    dispatch({ type: PartiesActions.PARTY, payload: party })
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
  if (party.faction?.name) {
    subheader += `Faction: ${party.faction.name} `
  }
  subheader += PS.rosterSummary(party)

  function generateKey(character: Character | Vehicle, index: number): string {
    return `${character.id}-${index}`
  }

  const avatar = party.image_url ? <ImageDisplay entity={party} /> : null

  return (
    <>
      <PartyCardBase
        title={party.name}
        subheader={subheader}
        action={deleteButton}
        avatar={avatar}
      >
        <CardMedia image={party.image_url || ""} sx={{padding: 2}}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 2, borderRadius: 0.5}}>
              <Typography>{party.description}</Typography>
              <Typography variant="h6" mt={2} gutterBottom>Members</Typography>
              { !!party?.characters?.length &&
              <>
                  {
                    party.characters.map((character, index) => {
                      const key = generateKey(character, index)
                      return (<Member key={key} character={character} removeCharacter={removeCharacter} />)
                    })
                  }
                </>
                }
                { !!party?.vehicles?.length &&
                <>
                  {
                    party.vehicles.map((character, index) => {
                      const key = generateKey(character, index)
                      return (<Member key={key} character={character} removeCharacter={removeCharacter} />)
                    })
                  }
              </> }
            </Box>
          </Stack>
        </CardMedia>
      </PartyCardBase>
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
