import Layout from "@/components/Layout"
import Head from "next/head"

import { useState, FormEvent, useRef } from "react"
import { Box, Button, Typography, Alert, Paper, Link, useTheme } from "@mui/material" // Import useTheme
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useClient, useToast } from "@/contexts"
import type { Character } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import { FormActions, useForm } from "@/reducers/formState"

type FormData = {
  file: File | null
  character: Character
  error: string
}

export default function UploadForm() {
  const { client } = useClient()
  const { toastError } = useToast()
  const theme = useTheme() // Use the theme hook to access theme colors

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ file: null, character: defaultCharacter, error: "" })
  const { success, error, formData } = formState
  const { file, character } = formData

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer?.files
    if (files && files[0]) {
      const selectedFile = files[0]
      if (selectedFile.type === "application/pdf") {
        dispatchForm({ type: FormActions.UPDATE, name: "file", value: selectedFile })
        dispatchForm({ type: FormActions.ERROR, payload: "" })
      } else {
        dispatchForm({ type: FormActions.UPDATE, name: "file", value: null })
        dispatchForm({ type: FormActions.ERROR, payload: "Please select a valid PDF file." })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      dispatchForm({ type: FormActions.UPDATE, name: "file", value: selectedFile })
      dispatchForm({ type: FormActions.ERROR, payload: "" })
    } else {
      dispatchForm({ type: FormActions.UPDATE, name: "file", value: null })
      dispatchForm({ type: FormActions.ERROR, payload: "Please select a valid PDF file." })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      dispatchForm({ type: FormActions.ERROR, payload: "No file selected." })
      return
    }

    const formData = new FormData()
    formData.append("pdf_file", file)

    try {
      const character = await client.uploadCharacterPdf(formData)
      dispatchForm({ type: FormActions.RESET, payload: { ...initialFormState, formData: { file: null, character, error: "" } } })
      dispatchForm({ type: FormActions.SUCCESS, payload: "Character created successfully!" })
    } catch (err) {
      console.error("Upload error:", err)
      dispatchForm({ type: FormActions.ERROR, payload: "Failed to upload PDF." })
      toastError("Failed to upload PDF")
    }
  }

  return (
    <>
      <Head>
        <title>Characters - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Upload PDF to Create Character
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>
                {success}{" "}
                <Link href={`/characters/${character.id}`} target="_blank">
                  {character.name}
                </Link>
              </Alert>}
              <Box sx={{ marginTop: 4 }} component="form" onSubmit={handleSubmit}>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  sx={{
                    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[500]}`,
                    borderRadius: 1,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    mb: 2,
                    backgroundColor: isDragActive ? theme.palette.grey[100] : "transparent",
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.grey[500] }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Drag and drop your PDF here or click to select
                  </Typography>
                  {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
                </Box>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  disabled={!file}
                  fullWidth
                >
                  Create Character
                </Button>
              </Box>
            </Paper>
          </Box>
        </Layout>
      </main>
    </>
  )
}
