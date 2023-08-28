import { Grid } from "@mui/material"
import { Character } from "@/types/types"
import type { Site as SiteType } from "@/types/types"
import { Subhead } from "@/components/StyledFields"
import AddSite from "@/components/characters/edit/sites/AddSite"
import Site from "@/components/characters/edit/sites/Site"


interface SitesProps {
  character: Character
}

export default function Sites({ character }: SitesProps) {
  const { sites } = character

  return (
    <>
      <Subhead>Feng Shui Sites ({sites.length})</Subhead>
      <Grid container spacing={2}>
        {
          sites.map((site: SiteType) => (
            <Grid key={site.id}>
              <Site key={site.id} site={site} />
            </Grid>
          ))
        }
      </Grid>
      <AddSite />
    </>
  )
}
