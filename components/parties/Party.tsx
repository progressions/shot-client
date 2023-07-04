import { IconButton, Box, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import Member from "./Member"
import PartyCardBase from "./PartyCardBase"
import ClearIcon from '@mui/icons-material/Clear'

import type { Character, Party as PartyType } from "../../types/types"

interface PartyProps {
  party: PartyType
}

export default function Party({ party }: PartyProps) {
  const { client } = useClient()
  const { toastError } = useToast()

  async function deleteFunction() {
    console.log("Deleting party", party.id)
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
