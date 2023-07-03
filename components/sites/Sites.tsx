import { Box, Typography } from "@mui/material"
import type { Site } from "../../types/types"

interface SitesProps {
  sites: Site[]
}

export default function Sites({ sites }: SitesProps) {
  return (
    <>
      {
        sites.map(site => (
          <Box key={site.id} mb={2}>
            <Typography variant="h2">{site.name}</Typography>
            <Typography>{site.description}</Typography>
            { site.faction && <Typography>Faction: {site.faction.name}</Typography> }
          </Box>
        ))
      }
    </>
  )
}
