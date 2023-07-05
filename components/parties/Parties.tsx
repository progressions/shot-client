import { Grid, Stack } from "@mui/material"
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
      <Grid container spacing={2}>
        {
          parties.map(party => (
            <Grid item key={party.id}>
              <Party key={party.id} party={party} state={state} dispatch={dispatch} />
            </Grid>
          ))
        }
      </Grid>
    </>
  )
}
