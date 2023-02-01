import { colors, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import { knownSkills } from "./edit/Skills"
import type { SkillValues } from "../../types/types"

interface SkillsDisplayProps {
  skills: SkillValues
}

export default function SkillsDisplay({ skills }: SkillsDisplayProps) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  function closePopover() {
    setAnchorEl(null)
    setOpen(false)
  }

  function showSkills(event: any) {
    setAnchorEl(event.target)
    setOpen(true)
  }

  const skillValues = knownSkills(skills)

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
            skillValues.map(([name, value]: any) => (
              <Typography key={name} gutterBottom sx={{color: "primary.dark"}}><strong>{name}</strong>: {value}</Typography>
            ))
          }
        </Box>
      </Popover>
    </>
  )
}
