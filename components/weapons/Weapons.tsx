import { Box, Stack } from "@mui/material"
import { Subhead } from "../StyledFields"
import type { Weapon as WeaponType } from "../types/types"
import Weapon from "./Weapon"
import { useCharacter } from "../../contexts/CharacterContext"

export default function Weapons({ filter, dispatchFilter }) {
  const { character } = useCharacter()
  const { weapons } = filter

  return (
    <Stack spacing={1}>
      <Subhead>Weapons</Subhead>
      <Box pb={2}>
        {
          weapons.map((weapon: WeaponType, index: number) => <Weapon key={`${weapon.id}_${index}`} weapon={weapon} filter={filter} dispatchFilter={dispatchFilter} />)
        }
      </Box>
    </Stack>
  )
}
