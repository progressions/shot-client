import { colors, Paper, Typography, Box, Card, CardMedia, CardContent } from "@mui/material"
import type { Weapon } from "@/types/types"
import WS from "@/services/WeaponService"

interface WeaponOverlayProps {
  weapon: Weapon | null
}

export default function WeaponOverlay({ weapon }: WeaponOverlayProps) {

  if (!weapon) return <></>

  return (
    <Box sx={{backgroundColor: colors.indigo[900]}}>
      <Card>
        <CardMedia
          component="img"
          image={weapon?.image_url || ""}
          alt={weapon?.name}
          sx={{
            maxHeight: 300,
            maxWidth: 450
          }}
        />
        <CardContent sx={{width: 400, backgroundColor: colors.indigo[900]}}>
          <Typography gutterBottom variant="h5" component="div">
            {WS.nameWithCategory(weapon)} {WS.stats(weapon)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {weapon.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
