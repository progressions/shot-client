import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"
import { Subhead } from "../StyledFields"
import NewAdvancement from "./NewAdvancement"

import { Stack, Typography } from "@mui/material"

export default function Advancements({ character, dispatch, handleSubmit }) {
  const { advancements } = character

  return (
    <>
      <Subhead>Advancements ({advancements.length})</Subhead>
      <Stack spacing={2}>
        {
          advancements.map((advancement) => (
            <Typography key={advancement.id}>{advancement.description}</Typography>
          ))
        }
        <NewAdvancement character={character} dispatch={dispatch} handleSubmit={handleSubmit} />
      </Stack>
    </>
  )
}
