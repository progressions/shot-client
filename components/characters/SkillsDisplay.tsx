import { colors, Stack, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import type { Character, SkillValue, SkillValues } from "@/types/types"
import CS from "@/services/CharacterService"
import { colorForValue } from "@/components/characters/ActionValueDisplay"

interface SkillsDisplayProps {
  character: Character
  first?: boolean
}

export default function SkillsDisplay({ character, first }: SkillsDisplayProps) {
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
      { first &&
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
          <IconButton onMouseEnter={showSkills} color="inherit">
            <ArticleIcon />
          </IconButton>
          <Typography gutterBottom>
            {skillValues.map(([key, value]) => `${key}: ${value}`).join(', ')}
          </Typography>
        </Stack>
      }
      { !first && <Tooltip title="Skills">
        <IconButton onMouseEnter={showSkills} color="inherit">
          <ArticleIcon />
        </IconButton>
      </Tooltip> }
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Box p={2} sx={{backgroundColor: colors.lightBlue[100]}}>
          {
            skillValues.map(([name, value]: SkillValue) => {
              return (
                <Typography key={name} gutterBottom sx={{color: "primary.dark"}}>
                  <strong>{name}</strong>:
                  <Typography component="span">{value}</Typography>
                </Typography>
              )
            })
          }
        </Box>
      </Popover>
    </>
  )
}
