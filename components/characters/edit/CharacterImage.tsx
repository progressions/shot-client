import { styled } from "@mui/material/styles"
import { Typography } from "@mui/material"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import Stack from "@mui/material/Stack"
import { useRef } from "react"
import { Character } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import Api from "../../../utils/Api"

interface CharacterImageProps {
  character: Character
}

const Input = styled("input")({
  display: "none",
})

export default function CharacterImage({ character }: CharacterImageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { jwt, client } = useClient()
  const { toastError, toastSuccess } = useToast()
  const api = new Api()

  async function handleUpload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    alert("upload")

    const file = inputRef.current?.files?.[0]

    if (!file) return
    const formData = new FormData()
    formData.append("character[image]", file)

    await submitToAPI(formData)
    toastSuccess("File uploaded.")
  }

  async function submitToAPI(data: FormData) {
    const url = api.allCharacters(character)
    const response = await client.requestFormData("PATCH", url, data)
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <label htmlFor="contained-button-file">
        <Input accept="image/*" id="contained-button-file" type="file" ref={inputRef} />
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
      <Button variant="outlined" onClick={handleUpload}>
        Save
      </Button>
    </Stack>
  )
}
