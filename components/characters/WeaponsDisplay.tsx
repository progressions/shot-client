import { colors, Stack, Typography, Box, Popover, Tooltip, IconButton } from "@mui/material"
import ArticleIcon from '@mui/icons-material/Article'
import { useState } from "react"
import { GiDeathSkull, GiShotgun, GiPistolGun } from "react-icons/gi"
import WS from "../../services/WeaponService"

import type { Weapon } from "../../types/types"

interface WeaponsDisplayProps {
  weapons: Weapon[]
}

export default function WeaponsDisplay({ weapons }: WeaponsDisplayProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [open, setOpen] = useState(false)

  function closePopover() {
    setAnchorEl(null)
    setOpen(false)
  }

  function showWeapons(event: React.SyntheticEvent<Element, Event>) {
    setAnchorEl(event.target as Element)
    setOpen(true)
  }

  if (!weapons.length) return <></>

  return (
    <>
      <Tooltip title="Weapons">
        <IconButton onMouseEnter={showWeapons} color="inherit">
          <GiPistolGun />
        </IconButton>
      </Tooltip>
      <Popover anchorEl={anchorEl} open={open} onClose={closePopover} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Box p={2} sx={{width: 500, backgroundColor: colors.green[100]}}>
          {
            weapons.map((weapon: Weapon, index: number) => (
              <Box key={weapon.name + index}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography gutterBottom sx={{color: "primary.dark"}}>
                    {WS.nameWithCategory(weapon)} {WS.stats(weapon)}
                  </Typography>
                    {
                      weapon.kachunk &&
                        <Typography sx={{color: "primary.dark"}}>
                            <GiShotgun />
                        </Typography>
                    }
                  {
                    weapon.mook_bonus === 1 &&
                    <>
                      <Typography sx={{color: "primary.dark"}}>
                        <GiDeathSkull />
                      </Typography>
                    </>
                  }
                  {
                    weapon.mook_bonus === 2 &&
                    <>
                      <Typography sx={{color: "primary.dark"}}>
                        <GiDeathSkull />
                        <GiDeathSkull />
                      </Typography>
                    </>
                  }
              </Stack>
                {
                  weapon.kachunk &&
                    <Typography gutterBottom sx={{marginTop: -1, marginLeft: 2, color: "primary.main"}} variant="subtitle2">
                      Damage Value is 14 if you spend a shot to go “KA-CHUNK!”
                    </Typography>
                }
                {
                  weapon.mook_bonus === 1 &&
                    <Typography gutterBottom sx={{marginTop: -1, marginLeft: 2, color: "primary.main"}} variant="subtitle2">
                      +1 Attack vs Mooks
                    </Typography>
                }
                {
                  weapon.mook_bonus === 2 &&
                    <Typography gutterBottom sx={{marginTop: -1, marginLeft: 2, color: "primary.main"}} variant="subtitle2">
                      +2 Attack vs Mooks
                    </Typography>
                }
              </Box>
            ))
          }
        </Box>
      </Popover>
    </>
  )
}
