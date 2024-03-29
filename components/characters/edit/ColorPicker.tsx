import { Button, TextField, Popover, Paper } from "@mui/material"
import { BlockPicker, ColorResult } from 'react-color'
import { StyledTextField } from "@/components/StyledFields"

import { useState } from "react"

import type { CharacterStateAction } from "@/reducers/characterState"
import type { VehicleStateAction } from "@/reducers/vehicleState"
import { CharacterActions } from "@/reducers/characterState"
import { VehicleActions } from "@/reducers/vehicleState"
import type { Character } from "@/types/types"

interface ColorPickerProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  setCharacter?: React.Dispatch<React.SetStateAction<Character>>
  dispatch?: React.Dispatch<CharacterStateAction> | React.Dispatch<VehicleStateAction>
}

export default function ColorPicker({ character, onChange, setCharacter, dispatch }: ColorPickerProps) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const togglePicker = (event: React.MouseEvent<HTMLElement>) => {
    if (picker) {
      setPicker(false)
      setAnchorEl(null)
    } else {
      setPicker(true)
      setAnchorEl(event.target as Element)
    }
  }

  const handleColor = (color: ColorResult) => {
    if (dispatch) {
      dispatch({ type: CharacterActions.UPDATE, name: "color", value: color?.hex })
    }
    if (setCharacter) {
      setCharacter((prevState: Character) => ({ ...prevState, color: color?.hex }))
    }
    setPicker(false)
    setAnchorEl(null)
  }

  return (
    <>
      <Button sx={{width: 2, height: 50, bgcolor: character.color, borderColor: 'primary', border: 1, borderRadius: 2}} onClick={togglePicker} />
      <StyledTextField id="colorPicker" label="Color" name="color" value={character.color || ''} onChange={onChange} />
      <Popover anchorEl={anchorEl} open={picker} onClose={() => setPicker(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Paper>
          <BlockPicker color={character.color || ''} onChangeComplete={handleColor} colors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
        </Paper>
      </Popover>
    </>
  )
}
