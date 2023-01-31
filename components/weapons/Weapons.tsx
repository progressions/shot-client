import { Stack } from "@mui/material"
import { Subhead } from "../StyledFields"
import type { Weapon as WeaponType } from "../types/types"
import Weapon from "./Weapon"
import AddWeapon from "./AddWeapon"
import CreateWeapon from "./CreateWeapon"
import { useCharacter } from "../../contexts/CharacterContext"

export default function Weapons({ filter, dispatchFilter }) {
  const { character } = useCharacter()
  const { weapons } = filter

  return (
    <Stack spacing={1}>
      <Subhead>Weapons</Subhead>
      {
        weapons.map((weapon: WeaponType, index: number) => <Weapon key={`${weapon.id}_${index}`} weapon={weapon} filter={filter} dispatchFilter={dispatchFilter} />)
      }
      { character?.id && <AddWeapon filter={filter} dispatchFilter={dispatchFilter} /> }
      { !character?.id && <CreateWeapon filter={filter} dispatchFilter={dispatchFilter} /> }
    </Stack>
  )
}
