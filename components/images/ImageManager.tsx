import { Box, Button, IconButton, LinearProgress, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useState, useRef } from "react"
import { useClient, useToast, useCharacter } from "@/contexts"
import Api from "@/utils/Api"
import { useUploadForm } from "@/utils/useUploadForm"
import DeleteIcon from "@mui/icons-material/Delete"
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"

import type { Juncture, User, Character, Party, Site, Vehicle, Weapon, Faction } from '@/types/types'

export type Entity = Weapon | Site | Party | Vehicle | Character | User | Faction | Juncture

interface ImageManagerProps {
  name: string
  entity: Entity
  updateEntity: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>) | ((event?: any) => Promise<void>)
  deleteImage: (entity: any) => Promise<void>
  apiEndpoint: string
}

const Input = styled("input")({
  display: "none",
})

export default function ImageManager({ name, entity, updateEntity, apiEndpoint, deleteImage }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(true)
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const api = new Api() as any
  const { isSuccess, uploadForm, progress } = useUploadForm(
    api[apiEndpoint](entity),
  )

  const file = inputRef.current?.files?.[0]

  const fileUploaded = inputRef?.current?.files && inputRef.current?.files?.length > 0

  async function removeImage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault()

    try {
      await deleteImage(entity)
      toastSuccess("Image deleted.")
      await updateEntity(event)
      if (inputRef?.current?.value) {
        inputRef.current.value = ""
      }
    } catch (error) {
      console.error(error)
      toastError("Error deleting image.")
    }
  }

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!file) return

    const formData = new FormData()
    formData.append(`${name}[image]`, file)

    try {
      await uploadForm(formData)
      toastSuccess("Image uploaded.")
      await updateEntity(event)
      if (inputRef?.current?.value) {
        inputRef.current.value = ""
      }
    } catch (error) {
      console.error(error)
      toastError("Error uploading image.")
    }
  }

  return (
    <>
      <Box
        border={1}
        sx={{width: 200, height: 300, backgroundImage: `url(${entity.image_url}?tr=w-200,h-300,c-maintain_ratio)`}}
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
          { !fileUploaded && entity.image_url &&
            <IconButton onClick={removeImage}>
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          }
          <label htmlFor="contained-button-file">
            <Input accept="image/*" id="contained-button-file" type="file" ref={inputRef} />
              { !fileUploaded &&
                <Button component="span">
                  <AddAPhotoIcon sx={{ color: "white" }} />
                </Button>
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
              <Typography>{inputRef?.current?.files?.[0]?.name}</Typography>
          </Box> || "" }
          { progress > 0 && <LinearProgress variant="determinate" value={progress} /> }
        </Box>
      </Box>
    </>
  )
}
