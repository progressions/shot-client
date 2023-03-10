import { colors, Stack, Button, Dialog, DialogTitle, Divider, Box, Typography, Autocomplete, Paper, TextField } from "@mui/material"
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

const PaperComponent=({ children }: React.PropsWithChildren) => (
  <Paper style={{ background: colors.blueGrey[100], color: "black" }}>
    <Typography component="span">
      {children}
    </Typography>
  </Paper>
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
    '&:disabled fieldset': {
      borderColor: 'green',
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

interface AnyProps {
  [key: string]: any
}

export function StyledSelect(props: AnyProps) {
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

export function Subhead(props: React.PropsWithChildren<AnyProps>) {
  return (
    <>
      <Divider color={colors.blue[100]} />
      <Box marginTop={3} marginBottom={1}>
        <Typography variant="h6" gutterBottom {...props}>
          { props.children }
        </Typography>
      </Box>
    </>
  )
}

export function StyledDialog(props: React.PropsWithChildren<AnyProps>) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      disableRestoreFocus
    >
      <DialogTitle sx={{backgroundColor: colors.blueGrey[300], color: "black"}}>
        {props.title}
      </DialogTitle>
      <Box component="form" onSubmit={props.onSubmit} pb={1} sx={{backgroundColor: colors.blueGrey[300], color: "black"}}>
        {props.children}
      </Box>
    </Dialog>
  )
}

export function CancelButton(props: React.PropsWithChildren<AnyProps>) {
  return (
    <Button variant="contained" color="secondary" {...props}>{ props.children ? props.children : "Cancel" }</Button>
  )
}

export function SaveButton(props: React.PropsWithChildren<AnyProps>) {
  return (
    <Button variant="contained" color="primary" type="submit" {...props}>{ props.children ? props.children : "Save" }</Button>
  )
}

export function SaveCancelButtons(props: React.PropsWithChildren<AnyProps>) {
  return (
    <Stack spacing={2} direction="row">
      <CancelButton disabled={props.disabled} onClick={props.onCancel}>{props.cancelText}</CancelButton>
      <SaveButton disabled={props.disabled} onClick={props.onSave}>{props.saveText}</SaveButton>
    </Stack>
  )
}

interface ButtonBarProps {
  sx?: any
}

export function ButtonBar({ children, sx }: React.PropsWithChildren<ButtonBarProps>) {
  return (
    <Box component={Paper} p={1} pt={2} mb={1} sx={sx}>
      <Stack direction="row" spacing={2} alignItems="top">
        { children }
      </Stack>
    </Box>
  )
}
