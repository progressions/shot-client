import { Box, Typography } from "@mui/material"

import type { Fight } from "../../types/types"

interface FightNameProps {
  fight: Fight
}

export default function FightName({ fight }: FightNameProps) {
  return (
    <>
      <Typography sx={{backgroundColor: "secondary.main", color: "white"}} variant="h6" p={1}>
        {fight.campaign.name}
      </Typography>
      <Typography variant="h2" gutterBottom>
        {fight.name}
      </Typography>
    </>
  )
}
