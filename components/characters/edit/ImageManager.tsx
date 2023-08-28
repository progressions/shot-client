import { Box, Button, IconButton, LinearProgress, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useState, useRef } from "react"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Api from "@/utils/Api"
import { useCharacter } from "@/contexts/CharacterContext"
import { useUploadForm } from "@/utils/useUploadForm"
import DeleteIcon from "@mui/icons-material/Delete"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"

import type { Character } from '@/types/types'

interface ImageManagerProps {
  character: Character
}

const Input = styled("input")({
  display: "none",
})

export default function ImageManager({ character }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(true)
  const { client, jwt } = useClient()
  const { toastError, toastSuccess } = useToast()
  const { updateCharacter } = useCharacter()
  const api = new Api()
  const { isSuccess, uploadForm, progress } = useUploadForm(
    api.allCharacters(character),
  )

  const file = inputRef.current?.files?.[0]

  const fileUploaded = inputRef.current?.files?.length > 0

  async function removeImage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()

    try {
      await client.deleteCharacterImage(character)
      toastSuccess("Image deleted.")
      await updateCharacter()
      inputRef.current.value = null
    } catch (error) {
      console.error(error)
      toastError("Error deleting image.")
    }
  }

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!file) return

    const formData = new FormData()
    formData.append("character[image]", file)

    try {
      await submitToAPI(formData)
      toastSuccess("Image uploaded.")
      await updateCharacter()
      inputRef.current.value = null
    } catch (error) {
      console.error(error)
      toastError("Error uploading file.")
    }
  }

  async function submitToAPI(data: FormData) {
    const response = await uploadForm(data)
  }

  return (
    <>
      <Box
        border={1}
        sx={{width: 200, height: 300, backgroundImage: `url(${character.image_url}?tr=w-200,h-300,c-maintain_ratio)`}}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            padding: 1,
            visibility: open ? 'visible' : 'hidden',
          }}
        >
        <Stack direction="row" justifyContent="center" spacing={1}>
          <IconButton variant="contained" onClick={removeImage}>
            <DeleteIcon sx={{ color: "white" }} />
          </IconButton>
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" ref={inputRef} />
              { !fileUploaded &&
                <IconButton variant="contained" component="span">
                  <AddAPhotoIcon sx={{ color: "white" }} />
                </IconButton>
              }
            </label>
          </Stack>
          { fileUploaded && <Button variant="contained" color="primary" onClick={handleUpload}>
            Save
          </Button> }
          { fileUploaded &&
            <Box
              sx={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
                color: "white",
                padding: 1,
                visibility: open ? 'visible' : 'hidden',
              }}
              >
              <Typography>{inputRef.current.files[0].name}</Typography>
          </Box> || "" }
          { progress > 0 && <LinearProgress variant="determinate" value={progress} /> }
        </Box>
      </Box>
    </>
  )
}
