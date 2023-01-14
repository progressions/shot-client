import { Box, Typography } from "@mui/material"

import type { Fight } from "../../types/types"

import { useFight } from "../../contexts/FightContext"

interface FightNameProps {
  fight: Fight
}

export default function FightName() {
  const [fight, setFight] = useFight()

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {fight.name}
      </Typography>
    </>
  )
}
