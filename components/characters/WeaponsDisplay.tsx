import { Link, CardContent, CardMedia, Card, colors, Stack, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import WS from "@/services/WeaponService"
import ImageIcon from "@mui/icons-material/Image"
import WeaponOverlay from "@/components/weapons/WeaponOverlay"

import type { Character, Weapon } from "@/types/types"

interface WeaponsDisplayProps {
  character: Character
  first?: boolean
}

export default function WeaponsDisplay({ character, first }: WeaponsDisplayProps) {
  const weapons = character.weapons
  if (!weapons.length) return <></>

  const weaponsList = weapons.map((weapon: Weapon) => weapon.name).join(', ').substring(0, 400)

  return (
    <>
      { first &&
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start">
          <Link href="/" data-mention-id={character.id} data-mention-class-name="Weapons" data-mention-data={JSON.stringify(weapons)} sx={{color: "white"}}>
            <IconButton color="inherit">
              <GiPistolGun />
            </IconButton>
          </Link>
          <Typography gutterBottom>
            { weaponsList }{ weaponsList.length > 399 ? '...' : ''}
          </Typography>
        </Stack>
      }
      { !first && <Tooltip title="Weapons">
        <Link href="/" data-mention-id={character.id} data-mention-class-name="Weapons" data-mention-data={JSON.stringify(weapons)} sx={{color: "white"}}>
          <IconButton color="inherit">
            <GiPistolGun />
          </IconButton>
        </Link>
      </Tooltip> }
    </>
  )
}
