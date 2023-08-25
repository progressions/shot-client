import { Stack } from "@mui/material"
import type { Site as SiteType } from "@/types/types"
import { SitesStateType, SitesActionType, SitesActions } from "@/reducers/sitesState"
import Site from "@/components/sites/Site"
import { Subhead } from "@/components/StyledFields"

interface SitesProps {
  state: SitesStateType,
  dispatch: React.Dispatch<SitesActionType>
}

export default function Sites({ state, dispatch }: SitesProps) {
  const { sites } = state

  return (
    <>
      <Subhead>Sites</Subhead>
      <Stack spacing={2} sx={{ width: "100%" }}>
        {
          sites.map(site => (
            <Site key={site.id} site={site} state={state} dispatch={dispatch} />
          ))
        }
      </Stack>
    </>
  )
}
