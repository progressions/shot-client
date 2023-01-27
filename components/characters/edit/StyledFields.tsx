import { colors, Typography, Autocomplete, Paper, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

const SelectProps = {
  MenuProps: {
    MenuListProps: {
      sx: {
        background: colors.blueGrey[100],
        color: colors.grey[800]
      }
    }
  }
}

const PaperComponent=({ children }) => (
  <Paper style={{ background: colors.blueGrey[100], color: "black" }}><Typography>{children}</Typography></Paper>
)

export const StyledTextField = styled(TextField)({
  '& label': {
    color: colors.grey[800],
  },
  '& .MuiOutlinedInput-root': {
    background: colors.blueGrey[200],
    color: "black",
    '& fieldset': {
      borderColor: colors.grey[800],
    },
    '&:hover fieldset': {
      borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'yellow',
    },
  },
  '& label.Mui-focused': {
    color: 'yellow',
  },
  '& .MuiSelect-select': {
    background: colors.blueGrey[200],
    color: "black",
  },
});

export function StyledSelect(props: any) {
  return (
    <StyledTextField {...props} SelectProps={SelectProps} />
  )
}

export function StyledAutocomplete(props: any) {
  return (
    <Autocomplete
      {...props}
      PaperComponent={PaperComponent}
    />
  )
}
