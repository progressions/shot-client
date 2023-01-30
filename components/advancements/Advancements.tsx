import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { Subhead } from "../StyledFields"
import NewAdvancement from "./NewAdvancement"
import Advancement from "./Advancement"

import { Stack, Typography } from "@mui/material"

export default function Advancements({ character, handleSubmit }) {
  const { advancements } = character

  return (
    <>
      <Subhead>Advancements ({advancements.length})</Subhead>
      <Stack spacing={2}>
        {
          advancements.map((advancement) => (
            <Advancement key={advancement.id} advancement={advancement} />
          ))
        }
        <NewAdvancement />
      </Stack>
    </>
  )
}
