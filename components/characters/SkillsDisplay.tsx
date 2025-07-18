import { Link, colors, Stack, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import type { Character, SkillValue, SkillValues } from "@/types/types"
import CS from "@/services/CharacterService"

interface SkillsDisplayProps {
  character: Character
  first?: boolean
}

export default function SkillsDisplay({ character, first }: SkillsDisplayProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [open, setOpen] = useState(false)

  const skillValues = CS.knownSkills(character)

  if (!skillValues.length) return <></>

  return (
    <>
      { first &&
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
          <Link data-mention-id={character.id} data-mention-class-name="Skills" data-mention-data={JSON.stringify(skillValues)} sx={{color: "white"}}>
            <IconButton color="inherit">
              <ArticleIcon />
            </IconButton>
          </Link>
          <Typography gutterBottom>
            {skillValues.map(([key, value]) => `${key}: ${value}`).join(', ')}
          </Typography>
        </Stack>
      }
      { !first &&
        <Link data-mention-id={character.id} data-mention-class-name="Skills" data-mention-data={JSON.stringify(skillValues)} sx={{color: "white"}}>
          <IconButton color="inherit">
            <ArticleIcon />
          </IconButton>
        </Link> }
    </>
  )
}
