import { IconButton, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import ClearIcon from '@mui/icons-material/Clear'
import type { Advancement as AdvancementType } from "../../types/types"

interface AdvancementProps {
  advancement: AdvancementType
}

export default function Advancement({ advancement }: AdvancementProps) {
  const { client } = useClient()
  const { toastError } = useToast()
  const { character, reloadCharacter } = useCharacter()

  async function deleteAdvancement() {
    const response = await client.deleteAdvancement(character, advancement)
    if (response.status === 200) {
      await reloadCharacter()
    } else {
      toastError()
    }
  }

  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Typography>{advancement.description}</Typography>
      <IconButton onClick={deleteAdvancement}>
        <ClearIcon />
      </IconButton>
    </Stack>
  )
}
