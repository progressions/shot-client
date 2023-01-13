import { Button, TextField, Popover, Paper } from "@mui/material"
import { BlockPicker } from 'react-color'

import { useState } from "react"

import type { Character } from "../../../types/types"

interface ColorPickerProps {
  character: Character
  onChange: any
  setCharacter: any
}

export default function ColorPicker({ character, onChange, setCharacter }) {
  const [picker, setPicker] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const togglePicker = (event: React.MouseEvent<HTMLElement>) => {
    if (picker) {
      setPicker(false)
      setAnchorEl(null)
    } else {
      setPicker(true)
      setAnchorEl(event.target as any)
    }
  }

  const handleColor = (color: any) => {
    setCharacter((prevState: Person) => ({ ...prevState, color: color?.hex }))
    setPicker(false)
    setAnchorEl(null)
  }

  return (
    <>
      <Button sx={{width: 2, height: 50, bgcolor: character.color, borderColor: 'primary', border: 1, borderRadius: 2}} onClick={togglePicker} />
      <TextField id="colorPicker" label="Color" name="color" value={character.color || ''} onChange={onChange} />
      <Popover anchorEl={anchorEl} open={picker} onClose={() => setPicker(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Paper>
          <BlockPicker color={character.color || ''} onChangeComplete={handleColor} colors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
        </Paper>
      </Popover>
    </>
  )
}
