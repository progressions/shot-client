import { Box, Typography } from "@mui/material"

import type { Fight } from "../../types/types"

interface FightNameProps {
  fight: Fight
}

export default function FightName({ fight }: FightNameProps) {
  return (
    <>
      <Typography variant="h2" gutterBottom>
        {fight.name}
      </Typography>
    </>
  )
}
