import Layout from "@/components/Layout"
import Head from "next/head"
import { Link, Stack, Box, Typography, Alert, Paper, useTheme, CircularProgress } from "@mui/material"
import { useCampaign, useClient, useToast } from "@/contexts"
import type { BackendErrorResponse, CableData, Character, CharacterJson } from "@/types/types"
import { FormActions, useForm } from "@/reducers/formState"
import { AxiosError } from "axios"
import { Editor } from "@/components/editor"
import { SaveButton, CancelButton, SaveCancelButtons } from "@/components/StyledFields"
import CS from "@/services/CharacterService"
import { FormEvent, useState, useEffect } from "react"
import { Subscription } from '@rails/actioncable'

type FormData = {
  description: string
  json: CharacterJson | null
  character: Character | null
}

export default function UploadForm() {
  const { client } = useClient()
  const { toastError } = useToast()
  const theme = useTheme()
  const consumer = client.consumer()
  const { campaign } = useCampaign()

  const { formState, dispatchForm, initialFormState } = useForm<FormData>({
    description: "",
    json: null,
    character: null,
  })
  const { disabled, loading, saving, success, error, formData } = formState
  const { description, json, character } = formData

  const [pending, setPending] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [subscription])

  async function handleSubmit() {
    dispatchForm({ type: FormActions.UPDATE, name: "character", value: null })
    dispatchForm({ type: FormActions.SUBMIT })
    setPending(true)
    try {
      const response = await client.generateAiCharacter({ description })

      const sub = consumer.subscriptions.create(
        { channel: "CampaignChannel", id: campaign?.id },
        {
          received: (data: CableData) => {
            if (data.status === 'preview_ready' && data.json) {
              const char = CS.characterFromJson(data.json) // data.json is guaranteed non-undefined here
              dispatchForm({ type: FormActions.UPDATE, name: "json", value: data.json })
              dispatchForm({ type: FormActions.SUCCESS, payload: "Character generated successfully" })
              setPending(false)
              sub.unsubscribe()
            } else if (data.status === 'error' && data.error) {
              handleError(new Error(data.error))
              setPending(false)
              sub.unsubscribe()
            }
          }
        }
      )
      setSubscription(sub)
    } catch (err) {
      handleError(err)
      setPending(false)
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
              { !json && !saving && !pending && <Typography>Enter a description to generate a character</Typography> }

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              { (saving || pending) && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4, mb: 2 }}>
                  <CircularProgress sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {pending ? "Character generation pending..." : "Generating character..."}
                  </Typography>
                </Box>
              )}
              {!saving && !pending && json && (
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
                  <Stack spacing="2" direction="row" sx={{mt: 2}}>
                    <SaveCancelButtons
                      cancelText="Clear"
                      saveText="Create Character"
                      onCancel={cancelForm}
                      onSave={generateCharacter}
                    />
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
                { !character?.id && !saving && !pending && <>
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
              { character?.id && !saving && !pending && (
                <Box sx={{ mt: 2 }}>
                  <SaveButton onClick={() => dispatchForm({ type: FormActions.RESET, payload: initialFormState })}>
                    Generate Another Character
                  </SaveButton>
                </Box>
              )}
            </Paper>
          </Box>
        </Layout>
      </main>
    </>
  )
}
