import Layout from "@/components/Layout"
import Head from "next/head"

import { useState, FormEvent } from "react"
import { colors, Box, Button, Typography, TextField, Alert, Paper, Link } from "@mui/material"
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

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ file: null, character: defaultCharacter, error: "" })
  const { success, error, formData } = formState
  const { file, character } = formData

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      dispatchForm({ type: FormActions.UPDATE, name: "file", value: selectedFile })
      dispatchForm({ type: FormActions.ERROR, payload: "" })
    } else {
      dispatchForm({ type: FormActions.UPDATE, name: "file", value: null })
      dispatchForm({ type: FormActions.ERROR, payload: "Please select a valid PDF file." })
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    if (!file) {
      dispatchForm({ type: FormActions.ERROR, payload: "No file selected." })
      return
    }

    const formData = new FormData();
    formData.append('pdf_file', file);

    try {
      const character = await client.uploadCharacterPdf(formData)
      dispatchForm({ type: FormActions.RESET, payload: { ...initialFormState, formData: { file: null, character, error: "" } } })
      dispatchForm({ type: FormActions.SUCCESS, payload: "Character created successfully!" })

      { (e.target as HTMLFormElement).reset(); }
    } catch (err) {
      console.error('Upload error:', err);
      dispatchForm({ type: FormActions.ERROR, payload: "Failed to upload PDF." })
      toastError('Failed to upload PDF');
    }
  };

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
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
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
              <Box sx={{marginTop: 4}} component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="file"
                  label="Upload PDF Form"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'application/pdf' }}
                  onChange={handleFileChange}
                  sx={{ mb: 2 }}
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
  </>)
}
