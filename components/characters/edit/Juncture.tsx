import { useClient } from "@/contexts"
import { TextField, Stack, Autocomplete } from "@mui/material"
import { useEffect, useReducer } from "react"
import { StyledAutocomplete, StyledTextField } from "@/components/StyledFields"
import type { Juncture, InputParamsType } from "@/types/types"
import { defaultJuncture } from "@/types/types"
import { FormActions, useForm } from '@/reducers/formState'

interface JunctureProps {
  juncture: Juncture | null
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
  width?: number
  sx?: React.CSSProperties
}

type FormData = {
  anchorEl: Element | null
  value: Juncture
  junctures: Juncture[]
}

export default function Juncture({ juncture, onChange, width, sx }: JunctureProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ anchorEl: null, value: juncture || defaultJuncture, junctures: [] })
  const { loading, formData } = formState
  const { anchorEl, value, junctures } = formData

  const { user, client } = useClient()

  useEffect(() => {
    if (user?.id) {
      getJunctures().catch(error => {
        console.error("Error fetching junctures:", error)
      })
    }
  }, [user])

  async function getJunctures() {
    try {
      const data = await client.getJunctures({ per_page: 1000 })
      console.log("Fetching junctures", data)
      dispatchForm({ type: FormActions.UPDATE, name: "junctures", value: data.junctures })
    } catch(error) {
      console.error(error)
    }
  }

  async function changeJuncture(event: React.ChangeEvent<HTMLInputElement>, newJuncture: Juncture) {
    if (newJuncture?.id === undefined && newJuncture?.name !== undefined) {
      const data = await client.createJuncture({ ...defaultJuncture, name: newJuncture.name })
      onChange({...event, target: {...event.target, name: "juncture_id", value: data.id as string}}, data.id as string)
      return
    }
    onChange({...event, target: {...event.target, name: "juncture_id", value: newJuncture?.id || "" as string}}, newJuncture?.id || "" as string)
  }

  console.log("juncture", juncture)

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={junctures}
          sx={sx || { width: width || 200 }}
          value={juncture || ""}
          onChange={changeJuncture}
          onOpen={getJunctures}
          openOnFocus
          renderInput={(params: InputParamsType) => <StyledTextField name="juncture_id" {...params} label="Juncture" />}
          getOptionLabel={(option: Juncture) => option.name || ""}
          filterOptions={(options: Juncture[], params: any) => {
            const filtered = options.filter((option: Juncture) => option.name.toLowerCase().includes(params.inputValue.toLowerCase()))
            if (filtered.length === 0 && params.inputValue !== "") {
              filtered.push({ name: params.inputValue } as Juncture)
            }
            return filtered
          }}
        />
      </Stack>
    </>
  )
}

