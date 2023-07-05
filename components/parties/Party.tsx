import { IconButton, Box, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import Member from "./Member"
import PartyCardBase from "./PartyCardBase"
import ClearIcon from '@mui/icons-material/Clear'

import type { PartiesStateType, PartiesActionType } from "../../reducers/partiesState"
import type { Character, Party as PartyType } from "../../types/types"
import { PartiesActions } from "../../reducers/partiesState"

interface PartyProps {
  party: PartyType
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function Party({ party, state, dispatch }: PartyProps) {
  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

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

  const deleteButton = (<IconButton key="delete" onClick={deleteFunction}>
    <ClearIcon />
  </IconButton>)

  return (
    <PartyCardBase
      title={party.name}
      subheader={`${party?.characters?.length} characters, ${party?.vehicles?.length} vehicles`}
      action={deleteButton}
    >
      <Typography>{party.description}</Typography>
      {
        !!party?.characters?.length &&
        <Box mt={2} mb={2}>
          {
            party.characters.map(character => (
              <Member key={character.id} character={character} />
            ))
          }
        </Box>
      }
    </PartyCardBase>
  )
}
