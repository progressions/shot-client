import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'
import WeaponCardBase from "./WeaponCardBase"

export default function Weapon({ weapon, filter, dispatchFilter }: any) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, reloadCharacter } = useCharacter()

  async function removeWeapon(event: any) {
    const response = await client.removeWeapon(character, weapon)
    if (response.status === 200) {
      await reloadCharacter()
    } else {
      toastError()
    }
  }

  async function deleteWeapon(event: any) {
    const doit = confirm("Delete this weapon? This cannot be undone.")
    if (!doit) return

    const response = await client.deleteWeapon(weapon)
    if (response.status === 200) {
      dispatchFilter({ type: "edit" })
    } else {
      toastError()
    }
  }

  const stats = `(${weapon.damage || "-"}/${weapon.concealment || "-"}/${weapon.reload_value || "-"})`

  const deleteFunction = character?.id ? removeWeapon : deleteWeapon

  const deleteButton = (<IconButton key="delete" onClick={deleteFunction}>
          <ClearIcon />
        </IconButton>)

  return (
    <>
      <WeaponCardBase
        title={`${weapon.name} ${stats}`}
        subheader={`${weapon.juncture} ${weapon.category}`}
        action={[deleteButton]}
      >
        <Typography variant="body2" gutterBottom>
          {weapon.description}
        </Typography>
        { weapon.mook_bonus > 0 && <Typography variant="subtitle2">+{weapon.mook_bonus} Attack vs Mooks</Typography> }
      </WeaponCardBase>
    </>
  )
}