import { Stack } from "@mui/material"
import { Subhead } from "../StyledFields"
import type { Weapon as WeaponType } from "../types/types"
import Weapon from "./Weapon"
import AddWeapon from "./AddWeapon"
import { useCharacter } from "../../contexts/CharacterContext"

export default function Weapons({ filter, dispatchFilter }) {
  const { weapons } = filter

  return (
    <Stack spacing={1}>
      <Subhead>Weapons</Subhead>
      {
        weapons.map((weapon: WeaponType, index: number) => <Weapon key={`${weapon.id}_${index}`} weapon={weapon} />)
      }
      <AddWeapon />
    </Stack>
  )
}
