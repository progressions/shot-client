import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { Subhead } from "../StyledFields"
import NewAdvancement from "./NewAdvancement"
import Advancement from "./Advancement"

import { Stack, Typography } from "@mui/material"

import type { Advancement as AdvancementType, Character } from "../../types/types"

interface AdvancementsProps {
  character: Character
}

export default function Advancements({ character }: AdvancementsProps) {
  const { advancements } = character

  return (
    <>
      <Subhead>Advancements ({advancements.length})</Subhead>
      <Stack spacing={2}>
        {
          advancements.map((advancement: AdvancementType) => (
            <Advancement key={advancement.id} advancement={advancement} />
          ))
        }
        <NewAdvancement />
      </Stack>
    </>
  )
}
