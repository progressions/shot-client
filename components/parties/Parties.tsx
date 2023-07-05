import { Stack } from "@mui/material"
import type { Party as PartyType } from "../../types/types"
import { PartiesStateType, PartiesActionType, PartiesActions } from "../../reducers/partiesState"
import Party from "./Party"
import { Subhead } from "../StyledFields"

interface PartiesProps {
  state: PartiesStateType,
  dispatch: React.Dispatch<PartiesActionType>
}

export default function Parties({ state, dispatch }: PartiesProps) {
  const { parties } = state

  return (
    <>
      <Subhead>Parties</Subhead>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {
          parties.map(party => (
            <Party key={party.id} party={party} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
    </>
  )
}
