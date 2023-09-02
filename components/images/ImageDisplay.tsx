import { Avatar, Dialog, DialogTitle, DialogContent, IconButton, Box, Card, CardContent, CardMedia, colors, Typography } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import { useState } from "react"
import { StyledDialog } from "@/components/StyledFields"
import type { Character, Site, Party } from "@/types/types"

type Entity = Site | Party | Character

interface ImageDisplayProps {
  entity: Entity
}

export default function ImageDisplay({ entity }: ImageDisplayProps) {
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
      { entity.image_url &&
        <Avatar
          onClick={showImage}
          src={entity.image_url && `${entity.image_url}?tr=w-75,h-75,fo-face`}
          variant="rounded"
          sx={{ bgcolor: 'secondary', width: 75, height: 75, borderColor: "secondary", borderWidth: 2, borderStyle: "solid", borderRadius: 1, cursor: "pointer" }}
        /> }
      { !entity.image_url &&
        <Avatar
          variant="rounded"
          sx={{ bgcolor: "secondary", width: 75, height: 75, borderColor: "secondary", borderWidth: 2, borderStyle: "solid", borderRadius: 1, cursor: "pointer" }}
        /> }
      <Dialog open={open} onClose={closeImage}>
        <DialogTitle sx={{backgroundColor: backgroundColor, color: "primary.dark"}}>
          { entity.name }
        </DialogTitle>
        <DialogContent sx={{backgroundColor: backgroundColor}}>
          <Card>
            <CardMedia
              component="img"
              image={entity.image_url || ""}
              alt={entity.name}
            />
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
