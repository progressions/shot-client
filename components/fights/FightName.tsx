import { Box, Typography } from "@mui/material"

import type { Fight } from "../../types/types"

import { useCurrentFight } from "../../contexts/CurrentFight"

interface FightNameProps {
  fight: Fight
}

export default function FightName() {
  const [fight, setFight] = useCurrentFight()

  console.log(fight)

  return (
    <>
      <Typography sx={{backgroundColor: "secondary.main", color: "white"}} variant="h6" p={1}>
        {fight?.campaign?.name || ""}
      </Typography>
      <Typography variant="h2" gutterBottom>
        {fight.name}
      </Typography>
    </>
  )
}
