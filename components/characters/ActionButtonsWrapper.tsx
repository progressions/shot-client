import { Slide, Stack } from '@mui/material'
import type { Character } from '@/types/types'
import PlayerTypeOnly from '@/components/PlayerTypeOnly'
import ActionValues from '@/components/characters/ActionValues'
import ActionButtons from '@/components/characters/ActionButtons'
import MookActionButtons from '@/components/characters/MookActionButtons'
import { useRef, useState } from 'react'
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';

interface ActionButtonsParams {
  first: boolean
  character: Character
  healWounds?: () => void
  takeWounds?: () => void
  takeAction?: () => void
  takeDodgeAction?: (character: Character) => void
  cheeseItAction?: (character: Character) => void
}

export default function ActionButtonsWrapper({
  first,
  character,
  healWounds,
  takeWounds,
  takeAction,
  takeDodgeAction,
  cheeseItAction
}: ActionButtonsParams) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Stack direction="row" spacing={1} justifyContent="space-between">
      <ActionValues character={character} />
      <Stack direction="row" justifyContent="flex-end" sx={{height: 30}} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} ref={containerRef}>
        <Slide direction="left" in={open} mountOnEnter unmountOnExit onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(open)} container={containerRef?.current}>
          <Stack direction="row" spacing={1} sx={{height: 30}} justifyContent="flex-end" ref={containerRef}>
            <PlayerTypeOnly character={character} except="Mook">
              <ActionButtons character={character}
                takeDodgeAction={takeDodgeAction}
                cheeseItAction={cheeseItAction}
              />
            </PlayerTypeOnly>
            <PlayerTypeOnly character={character} only="Mook">
              <MookActionButtons character={character}
                healWounds={healWounds}
                takeAction={takeAction}
              />
            </PlayerTypeOnly>
          </Stack>
        </Slide>
        { open ? <ArrowRightSharpIcon /> : <ArrowLeftSharpIcon /> }
      </Stack>
    </Stack>
  )
}
