import { Box, Typography } from "@mui/material"
import type { Site } from "../../types/types"

interface SitesProps {
  sites: Site[]
}

export default function Sites({ sites }: SitesProps) {
  console.log('Sites', sites)
  return (
    <>
      {
        sites.map(site => (
          <Box key={site.id} mb={2}>
            <Typography variant="h2">{site.name}</Typography>
            <Typography>{site.description}</Typography>
            { site.faction && <Typography>Faction: {site.faction.name}</Typography> }
            { site.characters && <Typography>Characters: {site.characters.map(character => character.name).join(', ')}</Typography> }
          </Box>
        ))
      }
    </>
  )
}
