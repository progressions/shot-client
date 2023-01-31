import { IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'

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
    const response = await client.deleteWeapon(weapon)
    if (response.status === 200) {
      dispatchFilter({ type: "edit" })
    } else {
      toastError()
    }
  }

  const stats = `(${weapon.damage || "-"}/${weapon.concealment || "-"}/${weapon.reload_value || "-"})`

  const deleteFunction = character?.id ? removeWeapon : deleteWeapon

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{fontWeight: "bold"}}>{weapon.name}</Typography>
      <Typography>{stats}</Typography>
      <IconButton onClick={deleteFunction}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
