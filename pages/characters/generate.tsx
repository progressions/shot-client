import Layout from "@/components/Layout"
import Head from "next/head"

import { Link, Stack, Box, Typography, Alert, Paper, useTheme, CircularProgress } from "@mui/material"
import { useClient, useToast } from "@/contexts"
import type { Character, CharacterJson } from "@/types/types"
import { FormActions, useForm } from "@/reducers/formState"
import { AxiosError } from "axios"
import { Editor } from "@/components/editor"
import { SaveButton, CancelButton, SaveCancelButtons } from "@/components/StyledFields"
import CS from "@/services/CharacterService"
import { FormEvent } from "react"

type FormData = {
  description: string
  json: CharacterJson | null
  character: Character | null
}

type BackendErrorResponse = {
  name?: string[]
  error?: string
  errors?: Record<string, string[]>
}

export default function UploadForm() {
  const { client } = useClient()
  const { toastError } = useToast()
  const theme = useTheme()

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({
    description: "",
    json: null,
    character: null,
  })
  const { disabled, loading, saving, success, error, formData } = formState
  const { description, json, character } = formData

  async function handleSubmit() {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: null })
    dispatchForm({ type: FormActions.SUBMIT })
    try {
      const data: CharacterJson = await client.generateAiCharacter({ description })

      const char = CS.characterFromJson(data)

      dispatchForm({ type: FormActions.UPDATE, name: "json", value: data })
      dispatchForm({ type: FormActions.SUCCESS, payload: "Character generated successfully" })
    } catch (err) {
      handleError(err)
    }
  }

  async function generateCharacter() {
    try {
      if (!json) return

      dispatchForm({ type: FormActions.SUBMIT })

      let characterFromJson = CS.characterFromJson(json)

      if (json.faction) {
        const factionData = await client.getFactions({ search: json.faction })
        const faction = factionData.factions[0]
        characterFromJson = CS.updateFaction(characterFromJson, faction)
      }
      if (json.juncture) {
        const junctureData = await client.getJunctures({ search: json.juncture })
        const juncture = junctureData.junctures[0]
        characterFromJson = CS.updateJuncture(characterFromJson, juncture)
      }

      const data = await client.createCharacter({ ...characterFromJson })

      dispatchForm({ type: FormActions.UPDATE, name: "character", value: data })
      dispatchForm({ type: FormActions.SUCCESS, payload: "Character saved successfully" })
    } catch (err) {
      handleError(err)
    }
  }

  function handleError(err: Error | AxiosError<BackendErrorResponse> | unknown) {
    let errorMessage = "An unexpected error occurred"
    if (err instanceof AxiosError) {
      const backendError = err.response?.data as BackendErrorResponse
      if (backendError.error) {
        errorMessage = backendError.error
      } else if (backendError.errors) {
        errorMessage = Object.values(backendError.errors).flat().join(", ")
      } else if (backendError.name) {
        errorMessage = backendError.name.join(", ")
      }
    } else if (err instanceof Error) {
      errorMessage = err.message
    }
    dispatchForm({ type: FormActions.ERROR, payload: errorMessage })
    toastError(errorMessage)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    dispatchForm({ type: FormActions.UPDATE, name, value })
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (
    <>
      <Head>
        <title>Generator - Chi War</title>
        <meta name="description" content="Feng Shui 2 Shot Counter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Generate Characters
              </Typography>
              { !json && !saving && <Typography>Enter a description to generate a character</Typography> }

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              { saving && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, mb: 2 }}>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Generating character...
                  </Typography>
                </Box>
              )}
              {!saving && json && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5">Name: {json.name}</Typography>
                  <Typography>Type: {json.type}</Typography>
                  <Typography>Description: {json.description}</Typography>
                  <Typography>{json.mainAttack}: {json.attackValue}</Typography>
                  <Typography>Defense: {json.defense}</Typography>
                  <Typography>Speed: {json.speed}</Typography>
                  <Typography>Toughness: {json.toughness}</Typography>
                  <Typography>Damage: {json.damage}</Typography>

                  { !character &&
                  <Stack spacing="2" direction="row">
                    <SaveButton onClick={generateCharacter} disabled={disabled || saving} sx={{ mt: 2 }}>
                      Generate Character
                    </SaveButton>
                    <CancelButton onClick={cancelForm} sx={{ mt: 2 }}>
                      Clear
                    </CancelButton>
                  </Stack> }
                  { character &&
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Character saved successfully!<br />
                    <Link href={`/characters/${character.id}`} target="_blank">
                      {character.name}
                    </Link>
                  </Typography> }
                </Box>
                )}
                { !saving && <>
                  <Box sx={{ my: 4 }} component="form" onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
                    handleSubmit()
                  }}>
                  <Box sx={{ mb: 2 }}>
                    <Editor name="description" value={description} onChange={handleChange} />
                  </Box>
                  <SaveCancelButtons
                    disabled={saving}
                    onCancel={() => dispatchForm({ type: FormActions.RESET, payload: initialFormState })}
                  />
                </Box>
              </> }
            </Paper>
          </Box>
        </Layout>
      </main>
    </>
  )
}
