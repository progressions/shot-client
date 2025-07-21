import { FormActions, useForm } from "@/reducers/formState"
import { StyledTextField } from "@/components/StyledFields"

import type { Archetype } from "@/types/types"

interface ArchetypeSelectProps {
  archetype: Archetype
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}

type FormData = {
  archetype: Archetype
}

export default function ArchetypeSelect({ archetype: initialArchetype, onChange }: ArchetypeSelectProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ archetype: initialArchetype })
  const { formData } = formState
  const { archetype } = formData

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || ""
    dispatchForm({ type: FormActions.UPDATE, name: "archetype", value: newValue })
  }

  return (
    <StyledTextField
      name="Archetype"
      label="Archetype"
      value={archetype || ""}
      fullWidth
      onChange={handleChange}
      onBlur={(event) => onChange(event as React.ChangeEvent<HTMLInputElement>, archetype)}
    />
  )
}
