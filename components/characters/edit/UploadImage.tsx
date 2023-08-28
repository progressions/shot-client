import { styled } from "@mui/material/styles"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import Stack from "@mui/material/Stack"
import { useRef } from "react"
import { Character } from "@/types/types"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import Api from "@/utils/Api"

interface UploadImageProps {
  character: Character
}

const Input = styled("input")({
  display: "none",
})

export default function UploadImage({ character }: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const api = new Api()

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const file = inputRef.current?.files?.[0]

    if (!file) return
    const formData = new FormData()
    formData.append("character[image]", file)

    try {
      await submitToAPI(formData)
      toastSuccess("File uploaded.")
    } catch (error) {
      toastError("Error uploading file.")
    }
  }

  async function submitToAPI(data: FormData) {
    const url = api.allCharacters(character)
    const response = await client.requestFormData("PATCH", url, data)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="button-file">
        <Input accept="image/*" id="button-file" type="file" ref={inputRef} />
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Save
      </Button>
    </Stack>
  )
}
