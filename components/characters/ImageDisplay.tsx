import { Dialog, DialogTitle, DialogContent, IconButton, Box, Card, CardContent, CardMedia, colors, Typography } from "@mui/material"
import CS from "../../services/CharacterService"
import ImageIcon from "@mui/icons-material/Image"
import { useState } from "react"
import { StyledDialog } from "../../components/StyledFields"
import type { Character } from "../../types/types"

interface ImageDisplayProps {
  character: Character
}

export default function ImageDisplay({ character }: ImageDisplayProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  function showImage(event: React.SyntheticEvent<Element, Event>) {
    setOpen(true)
    setAnchorEl(event.target as Element)
  }

  function closeImage() {
    setOpen(false)
    setAnchorEl(null)
  }

  const backgroundColor = colors.orange[50]

  if (!character.image_url) return null

  return (
    <>
      <IconButton sx={{color: "inherit", "&:hover": { color: "primary.light" }}} onClick={showImage}>
        <ImageIcon sx={{fontSize: 30}} />
      </IconButton>
      <Dialog open={open} onClose={closeImage}>
        <DialogTitle sx={{backgroundColor: backgroundColor, color: "primary.dark"}}>
          { CS.name(character) }
        </DialogTitle>
        <DialogContent sx={{backgroundColor: backgroundColor}}>
          <Card>
            <CardMedia
              component="img"
              image={character.image_url || ""}
              alt={character.name}
            />
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
