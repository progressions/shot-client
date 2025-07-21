import { FormActions, useForm } from "@/reducers/formState"
import { StyledSelect, StyledAutocomplete } from "@/components/StyledFields"
import type { InputParamsType } from "@/types/types"

interface WealthSelectProps {
  wealth: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}

type FormData = {
  wealth: string
}

export default function WealthSelect({ wealth: initialWealth, onChange }: WealthSelectProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ wealth: initialWealth })
  const { formData } = formState
  const { wealth } = formData

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || ""
    dispatchForm({ type: FormActions.UPDATE, name: "wealth", value: newValue })
  }

  const options = ["Poor", "Working Stiff", "Rich"]

  return (
    <StyledAutocomplete
      freeSolo
      defaultValue={initialWealth}
      name="Wealth"
      label="Wealth"
      options={options}
      value={wealth || ""}
      onChange={handleChange}
      sx={{width: 200}}
      onBlur={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ ...event, target: { ...event.target, name: "wealth", value: event.target.value || "" } } as React.ChangeEvent<HTMLInputElement>, wealth)}
      renderInput={(params: InputParamsType) => <StyledSelect {...params} label="Wealth" sx={{width: "100%"}} />}
    />
  )
}
