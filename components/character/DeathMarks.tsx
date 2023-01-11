import { Rating } from "@mui/material"
import { styled } from '@mui/material/styles'
import { IoSkull, IoSkullOutline } from "react-icons/io5"

import type { Character } from "../../types/types"

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#000',
  },
  '& .MuiRating-iconHover': {
    color: '#333',
  },
});

interface DeathMarksProps {
  character: Character
  readOnly?: boolean
  onChange?: any
}

export default function DeathMarks({ character, readOnly, onChange }: DeathMarksProps) {
  return (
    <StyledRating
      size="small"
      name="Marks of Death"
      readOnly={readOnly}
      onChange={onChange}
      value={character.action_values["Marks of Death"] as number}
      icon={<IoSkull />}
      emptyIcon={<IoSkullOutline />}
      max={5} />
  )
}
