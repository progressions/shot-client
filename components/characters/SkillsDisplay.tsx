import { colors, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import type { Character, SkillValue, SkillValues } from "@/types/types"
import CS from "@/services/CharacterService"
import { colorForValue } from "@/components/characters/ActionValueDisplay"

interface SkillsDisplayProps {
  character: Character
}

export default function SkillsDisplay({ character }: SkillsDisplayProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [open, setOpen] = useState(false)

  function closePopover() {
    setAnchorEl(null)
    setOpen(false)
  }

  function showSkills(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(event.target as Element)
    setOpen(true)
  }

  const skillValues = CS.knownSkills(character)

  if (!skillValues.length) return <></>

  return (
    <>
      <Tooltip title="Skills">
        <IconButton onMouseEnter={showSkills} color="inherit">
          <ArticleIcon />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Box p={2} sx={{backgroundColor: colors.lightBlue[100]}}>
          {
            skillValues.map(([name, value]: SkillValue) => {
              const color = CS.impairments(character) ? "red" : "primary.dark"
              return (
                <Typography key={name} gutterBottom sx={{color: "primary.dark"}}>
                  <strong>{name}</strong>:
                  <Typography component="span" sx={{color: color}}>{value}</Typography>
                </Typography>
              )
            })
          }
        </Box>
      </Popover>
    </>
  )
}
