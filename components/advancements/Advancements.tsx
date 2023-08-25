import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { Subhead } from "@/components/StyledFields"
import NewAdvancement from "@/components/advancements/NewAdvancement"
import Advancement from "@/components/advancements/Advancement"

import { Grid } from "@mui/material"

import type { Advancement as AdvancementType, Character } from "@/types/types"

interface AdvancementsProps {
  character: Character
}

export default function Advancements({ character }: AdvancementsProps) {
  const { advancements } = character

  return (
    <>
      <Subhead>Advancements ({advancements.length})</Subhead>
      <Grid container spacing={2}>
        {
          advancements.map((advancement: AdvancementType) => (
            <Grid key={advancement.id}>
              <Advancement advancement={advancement} />
            </Grid>
          ))
        }
      </Grid>
      <NewAdvancement />
    </>
  )
}
