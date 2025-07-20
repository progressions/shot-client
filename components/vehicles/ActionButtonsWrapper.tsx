import { Slide, Stack } from '@mui/material'
import type { Vehicle } from '@/types/types'
import ActionButtons from "@/components/vehicles/ActionButtons"
import MookActionButtons from "@/components/vehicles/MookActionButtons"
import PlayerTypeOnly from '@/components/PlayerTypeOnly'
import { useRef, useState } from 'react'
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';

interface ActionButtonsWrapperProps {
  character: Vehicle
}

export default function ActionButtonsWrapper({
  character,
}: ActionButtonsWrapperProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (<>
    <Stack direction="row" justifyContent="flex-end" sx={{height: 30}} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} ref={containerRef}>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(open)} container={containerRef?.current}>
        <Stack direction="row" spacing={1} sx={{height: 30}} justifyContent="flex-end" ref={containerRef}>
          <PlayerTypeOnly character={character} except="Mook">
            <ActionButtons character={character} />
          </PlayerTypeOnly>
          <PlayerTypeOnly character={character} only="Mook">
            <MookActionButtons character={character} />
          </PlayerTypeOnly>
        </Stack>
      </Slide>
      { open ? <ArrowRightSharpIcon /> : <ArrowLeftSharpIcon /> }
    </Stack>
  </>)
}
