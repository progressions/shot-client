import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

import { Tooltip, IconButton, Stack } from "@mui/material"
import { useMemo } from "react"

import EffectsModal from "./EffectsModal"
import Effects from "./Effects"
import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"

import { effectsGroupedByType } from "../effects/GroupedEffects"

export default function GroupedEffects({ character }: any) {
  const { fight } = useFight()
  const effects = useMemo(() => (effectsGroupedByType(fight.character_effects[character.id] || [])), [character, fight])

  const severities = ["error", "warning", "info", "success"]

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {
          severities.map((severity) => {
            if (effects[severity]) {
              return <Effects key={severity} effects={effects[severity]} severity={severity} />
            }
          })
        }
        <EffectsModal character={character} />
      </Stack>
    </>
  )
}
