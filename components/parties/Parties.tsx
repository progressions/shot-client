import { Link, Box, Typography } from "@mui/material"
import type { Party } from "../../types/types"
import { PartiesStateType, PartiesActionType, PartiesActions } from "../../reducers/partiesState"
import Member from "./Member"

interface PartiesProps {
  state: PartiesStateType,
  dispatch: React.Dispatch<PartiesActionType>
}

export default function Parties({ state, dispatch }: PartiesProps) {
  const { parties } = state

  return (
    <>
      {
        parties.map(party => (
          <Box key={party.id} mb={2}>
            <Typography variant="h2">{party.name}</Typography>
            <Typography>{party.description}</Typography>
            {
              !!party.characters.length &&
              <Box mt={2} mb={2}>
                <Typography variant="h4" gutterBottom>Members</Typography>
                {
                  party.characters.map(character => (
                    <Member key={character.id} character={character} />
                  ))
                }
              </Box>
            }
          </Box>
        ))
      }
    </>
  )
}
