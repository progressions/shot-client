import { IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'

export default function Weapon({ weapon }: any) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, reloadCharacter } = useCharacter()

  async function deleteWeapon(event: any) {
    const response = await client.removeWeapon(character, weapon)
    if (response.status === 200) {
      await reloadCharacter()
    } else {
      toastError()
    }
  }

  const stats = `(${weapon.damage}/${weapon.concealment}/${weapon.reload_value})`

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{fontWeight: "bold"}}>{weapon.name}</Typography>
      <Typography>{stats}</Typography>
      <IconButton onClick={deleteWeapon}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
