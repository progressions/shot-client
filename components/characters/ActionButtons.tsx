import { colors, Slide, Stack, Box, ButtonGroup, Button, Tooltip } from "@mui/material"
import BoltIcon from "@mui/icons-material/Bolt"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import FavoriteIcon from "@mui/icons-material/Favorite"
import RunCircleIcon from "@mui/icons-material/RunCircle"
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp"
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';

import GamemasterOnly from "@/components/GamemasterOnly"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { useClient } from "@/contexts"
import CS from "@/services/CharacterService"
import { useRef, useState } from "react"

import type { Character, CharacterType } from "@/types/types"

interface ActionButtonsParams {
  character: Character,
  healWounds?: (character: Character) => void,
  takeWounds?: (character: Character) => void,
  takeConditionPoints?: (character: Character) => void,
  takeAction?: (character: Character) => void,
  editCharacter?: (character: Character) => void,
  deleteCharacter?: (character: Character) => void,
  takeDodgeAction?: (character: Character) => void,
  cheeseItAction?: (character: Character) => void
}

export default function ActionButtons({ character, healWounds, cheeseItAction, takeWounds, takeConditionPoints, takeAction, editCharacter, deleteCharacter, takeDodgeAction }: ActionButtonsParams) {
  const { user } = useClient()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const woundLabel = CS.isMook(character) ? "Kill Mooks" : "Take Smackdown"
  const woundIcon = <HeartBrokenIcon color='error' />

  return (
    <>
    <Stack direction="row" justifyContent="flex-end" sx={{height: 30, width: 350}} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} ref={containerRef}>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(open)} container={containerRef?.current}>
        <Stack direction="row" spacing={1} sx={{width: 260, height: 30}} justifyContent="flex-end" ref={containerRef}>
        <ButtonGroup variant="contained" size="small">
          { cheeseItAction && <Tooltip title="Cheese It" arrow>
            <Button variant="contained" sx={{color: "black", backgroundColor: "#eb8334"}} onClick={() => cheeseItAction(character)}>
              <RunCircleIcon sx={{width: 33, height: 33}} />
            </Button>
          </Tooltip> }
        </ButtonGroup>
        <ButtonGroup variant="contained" size="small">
          { takeWounds &&
            <Tooltip title={woundLabel} arrow>
              <Button onClick={() => {takeWounds(character)}}>
                {woundIcon}
              </Button>
            </Tooltip> }
          { healWounds &&
          <PlayerTypeOnly character={character} except="Mook">
            <Tooltip title="Heal Wounds" arrow>
              <Button variant="contained" onClick={() => {healWounds(character)}}>
                <FavoriteIcon color="error" />
              </Button>
            </Tooltip>
          </PlayerTypeOnly> }
        </ButtonGroup>
        <ButtonGroup variant="outlined" size="small" className="actionButtons">
          { takeDodgeAction && <Tooltip title="Dodge" arrow>
            <Button variant="contained" color="highlight" onClick={() => takeDodgeAction(character)}>
              <DirectionsRunIcon />
            </Button>
          </Tooltip> }
          { takeAction && <Tooltip title="Take Action" arrow>
            <Button sx={{width: 60}} variant="contained" color="highlight" onClick={() => {takeAction(character)}}>
              <BoltIcon sx={{width: 50, height: 50}} />
            </Button>
          </Tooltip> }
        </ButtonGroup>
      </Stack>
    </Slide>
    { open ? <ArrowRightSharpIcon /> : <ArrowLeftSharpIcon /> }
  </Stack>
  </>
  )
}
