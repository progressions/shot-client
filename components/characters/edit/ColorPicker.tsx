import { Button, TextField, Popover, Paper } from "@mui/material"
import { BlockPicker, ColorResult } from 'react-color'
import { StyledTextField } from "@/components/StyledFields"

import { useState } from "react"

import type { CharacterStateAction } from "@/reducers/characterState"
import type { VehicleStateAction } from "@/reducers/vehicleState"
import { CharacterActions } from "@/reducers/characterState"
import { VehicleActions } from "@/reducers/vehicleState"
import type { Character } from "@/types/types"
import { FormActions, useForm } from "@/reducers/formState"

interface ColorPickerProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  setCharacter?: React.Dispatch<React.SetStateAction<Character>>
  dispatch?: React.Dispatch<CharacterStateAction> | React.Dispatch<VehicleStateAction>
}

type FormData = {
  picker: boolean
  anchorEl: Element | null
}

export default function ColorPicker({ character, onChange, setCharacter, dispatch }: ColorPickerProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ picker: false, anchorEl: null })
  const { formData } = formState
  const { picker, anchorEl } = formData

  const togglePicker = (event: React.MouseEvent<HTMLElement>) => {
    if (picker) {
      dispatchForm({ type: FormActions.UPDATE, name: "picker", value: false })
      dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: null })
    } else {
      dispatchForm({ type: FormActions.UPDATE, name: "picker", value: true })
      dispatchForm({ type: FormActions.UPDATE, name: "anchorEl", value: event.target as Element })
    }
  }

  const handleColor = (color: ColorResult) => {
    if (dispatch) {
      dispatch({ type: CharacterActions.UPDATE, name: "color", value: color?.hex })
    }
    if (setCharacter) {
      setCharacter({ ...character, color: color?.hex })
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
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
