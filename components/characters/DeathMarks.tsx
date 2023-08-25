import { Rating } from "@mui/material"
import { styled } from '@mui/material/styles'
import { IoSkull, IoSkullOutline } from "react-icons/io5"

import type { Character } from "@/types/types"
import CS from "@/services/CharacterService"

const StyledRating = styled(Rating)({
  '& .MuiRating-icon': {
    color: '#fff',
  },
  '& .MuiRating-iconFilled': {
    color: '#fff',
  },
  '& .MuiRating-iconHover': {
    color: '#ddd',
  },
})

interface DeathMarksProps {
  character: Character
  readOnly?: boolean
  onChange?: (event: React.SyntheticEvent<Element, Event>, newValue: number | null) => void
}

export const deathMarkIcons = (character: Character) => {
  if (!CS.marksOfDeath(character)) { return [] }

  const icons = []
  for (let i=1; i <= 5; i++) {
    if (i <= CS.marksOfDeath(character)) {
      icons.push(<IoSkull key={`Mark ${i}`} />)
    } else {
      icons.push(<IoSkullOutline key={`Mark ${i}`} />)
    }
  }

  return icons
}

export default function DeathMarks({ character, readOnly, onChange }: DeathMarksProps) {
  if (readOnly) {
    return (
    <>
      {
        deathMarkIcons(character).map((icon) => (icon))
      }
    </>)
  } else {
    return (
      <StyledRating
        size="small"
        name="Marks of Death"
        readOnly={readOnly}
        onChange={onChange}
        value={CS.marksOfDeath(character)}
        icon={<IoSkull />}
        emptyIcon={<IoSkullOutline />}
        max={5} />
    )
  }
}
