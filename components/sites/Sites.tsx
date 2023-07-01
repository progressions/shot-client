import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { Subhead } from "../StyledFields"
import AddSite from "./AddSite"
import Site from "./Site"

import { Stack, Typography } from "@mui/material"

import type { Site as SiteType, Character } from "../../types/types"

interface SitesProps {
  character: Character
}

export default function Sites({ character }: SitesProps) {
  const { sites } = character

  return (
    <>
      <Subhead>Feng Shui Sites ({sites.length})</Subhead>
      <Stack spacing={2}>
        {
          sites.map((site: SiteType) => (
            <Site key={site.id} site={site} />
          ))
        }
        <AddSite />
      </Stack>
    </>
  )
}
