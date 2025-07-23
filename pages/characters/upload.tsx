import Layout from "@/components/Layout"
import Head from "next/head"

import { useState, FormEvent, useRef } from "react"
import { Box, Button, Typography, Alert, Paper, Link, useTheme, CircularProgress } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { useClient, useToast } from "@/contexts"
import type { Character } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import { FormActions, useForm } from "@/reducers/formState"

type FormData = {
  files: File[]
  characters: Character[]
  error: string
}

export default function UploadForm() {
  const { client } = useClient()
  const { toastError } = useToast()
  const theme = useTheme()

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ files: [], characters: [], error: "" })
  const { success, error, formData } = formState
  const { files, characters } = formData

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

    const droppedFiles = Array.from(e.dataTransfer?.files || [])
    const pdfFiles = droppedFiles.filter(file => file.type === "application/pdf")

    if (pdfFiles.length === 0) {
      dispatchForm({ type: FormActions.UPDATE, name: "files", value: [] })
      dispatchForm({ type: FormActions.ERROR, payload: "Please select valid PDF files." })
    } else {
      dispatchForm({ type: FormActions.UPDATE, name: "files", value: pdfFiles })
      dispatchForm({ type: FormActions.ERROR, payload: "" })
      if (pdfFiles.length < droppedFiles.length) {
        dispatchForm({ type: FormActions.ERROR, payload: "Some files were not valid PDFs and were ignored." })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const pdfFiles = selectedFiles.filter(file => file.type === "application/pdf")

    if (pdfFiles.length === 0) {
      dispatchForm({ type: FormActions.UPDATE, name: "files", value: [] })
      dispatchForm({ type: FormActions.ERROR, payload: "Please select valid PDF files." })
    } else {
      dispatchForm({ type: FormActions.UPDATE, name: "files", value: pdfFiles })
      dispatchForm({ type: FormActions.ERROR, payload: "" })
      if (pdfFiles.length < selectedFiles.length) {
        dispatchForm({ type: FormActions.ERROR, payload: "Some files were not valid PDFs and were ignored." })
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      dispatchForm({ type: FormActions.ERROR, payload: "No files selected." })
      return
    }

    setIsLoading(true)
    const uploadedCharacters: Character[] = []
    const uploadErrors: string[] = []

    for (const file of files) {
      const formData = new FormData()
      formData.append("pdf_file", file)

      try {
        const character = await client.uploadCharacterPdf(formData)
        uploadedCharacters.push(character)
      } catch (err) {
        console.error(`Upload error for ${file.name}:`, err)
        uploadErrors.push(`Failed to upload ${file.name}`)
        toastError(`Failed to upload ${file.name}`)
      }
    }

    dispatchForm({ type: FormActions.RESET, payload: { ...initialFormState, formData: { files: [], characters: uploadedCharacters, error: "" } } })

    if (uploadErrors.length > 0) {
      dispatchForm({ type: FormActions.ERROR, payload: uploadErrors.join("\n") })
    }

    if (uploadedCharacters.length > 0) {
      dispatchForm({ type: FormActions.SUCCESS, payload: `${uploadedCharacters.length} character${uploadedCharacters.length > 1 ? "s" : ""} created successfully!` })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsLoading(false)
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
                Upload PDFs to Create Characters
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>
                {success}
                <br />
                {characters.map((character, index) => (
                  <span key={character.id}>
                    {index > 0 && ", "}
                    <Link href={`/characters/${character.id}`} target="_blank">
                      {character.name}
                    </Link>
                  </span>
                ))}
              </Alert>}
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <CircularProgress />
                </Box>
              )}
              <Box sx={{ marginTop: 4 }} component="form" onSubmit={handleSubmit}>
                <Box
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  sx={{
                    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[500]}`,
                    borderRadius: 1,
                    p: 4,
                    textAlign: "center",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    mb: 2,
                    backgroundColor: isDragActive ? theme.palette.grey[100] : "transparent",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.grey[500] }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Drag and drop your PDFs here or click to select
                  </Typography>
                  {files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {files.map((file) => (
                        <Typography key={file.name} variant="body2">
                          {file.name}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  disabled={files.length === 0 || isLoading}
                  fullWidth
                >
                  {isLoading ? "Processing..." : "Create Characters"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Layout>
      </main>
    </>
  )
}
