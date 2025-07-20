import { colors, Slide, Stack, Box, ButtonGroup, Button, Tooltip } from "@mui/material"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import RunCircleIcon from "@mui/icons-material/RunCircle"
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp"
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import WoundsModal from "@/components/characters/WoundsModal"
import HealModal from "@/components/characters/HealModal"
import ActionModal from "@/components/characters/ActionModal"
import KillMooksModal from "@/components/characters/KillMooksModal"

import GamemasterOnly from "@/components/GamemasterOnly"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { useClient } from "@/contexts"
import CS from "@/services/CharacterService"
import { useState } from "react"

import type { Character, CharacterType } from "@/types/types"

interface ActionButtonsParams {
  character: Character,
  takeDodgeAction?: (character: Character) => void,
  cheeseItAction?: (character: Character) => void
}

export default function ActionButtons({ character, cheeseItAction, takeDodgeAction }: ActionButtonsParams) {
  const { user } = useClient()

  return (
    <>
      <ButtonGroup variant="contained" size="small">
        { cheeseItAction && <Tooltip title="Cheese It" arrow>
          <Button variant="contained" sx={{color: "black", backgroundColor: "#eb8334"}} onClick={() => cheeseItAction(character)}>
            <RunCircleIcon sx={{width: 33, height: 33}} />
          </Button>
        </Tooltip> }
      </ButtonGroup>
      <ButtonGroup variant="contained" size="small">
        <WoundsModal character={character} />
        <HealModal character={character} />
      </ButtonGroup>
      <ButtonGroup variant="outlined" size="small" className="actionButtons">
        { takeDodgeAction && <Tooltip title="Dodge" arrow>
          <Button variant="contained" color="highlight" onClick={() => takeDodgeAction(character)}>
            <DirectionsRunIcon />
          </Button>
        </Tooltip> }
        <ActionModal character={character} />
      </ButtonGroup>
  </>
  )
}
