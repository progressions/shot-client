import { Avatar, Dialog, DialogTitle, DialogContent, IconButton, Box, Card, CardContent, CardMedia, colors, Typography } from "@mui/material"
import CS from "@/services/CharacterService"
import ImageIcon from "@mui/icons-material/Image"
import { useState } from "react"
import type { Character } from "@/types/types"

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

  return (
    <>
      { character.image_url &&
        <Avatar
          onClick={showImage}
          src={character.image_url && `${character.image_url}?tr=w-75,h-75,fo-face`}
          variant="rounded"
          sx={{ bgcolor: character.color || 'secondary', width: 75, height: 75, borderColor: character.color, borderWidth: 2, borderStyle: "solid", borderRadius: 1, cursor: "pointer" }}
        /> }
      { !character.image_url &&
        <Avatar
          variant="rounded"
          sx={{ bgcolor: character.color || 'secondary', width: 75, height: 75, borderColor: character.color, borderWidth: 2, borderStyle: "solid", borderRadius: 1, cursor: "pointer" }}
        /> }
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
