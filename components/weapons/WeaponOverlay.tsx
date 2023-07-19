import { Typography, Box, Card, CardMedia, CardContent } from "@mui/material"
import type { Weapon } from "../../types/types"
import WS from "../../services/WeaponService"

interface WeaponOverlayProps {
  weapon: Weapon | null
}

export default function WeaponOverlay({ weapon }: WeaponOverlayProps) {

  if (!weapon) return <></>

  return (
    <Box m={2}>
      <Card sx={{width: 450, maxWidth: 450, margin: 2}}>
        <CardMedia
          component="img"
          image={weapon?.image_url || ""}
          alt={weapon?.name}
          sx={{
            maxHeight: 300,
            maxWidth: 450
          }}
        />
      </Card>
      <CardContent sx={{width: 450}}>
        <Typography gutterBottom variant="h5" component="div">
          {WS.nameWithCategory(weapon)} {WS.stats(weapon)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {weapon.description}
        </Typography>
      </CardContent>
    </Box>
  )
}
