import { DialogActions, DialogContent, colors, Stack, Button, Dialog, DialogTitle, Divider, Box, Typography, Autocomplete, Paper, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import styles from "@/components/editor/Editor.module.scss"

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

export const StyledRichText = styled(Box)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
  marginTop: '0.5rem',
  borderRadius: '4px',
  '& p': {
    margin: '0 0 0.5rem',
  },
  '& ul, & ol': {
    paddingLeft: '1.5rem',
    margin: '0.5rem 0',
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: '1.5rem 0 1rem',
    fontWeight: theme.typography.fontWeightBold,
    color: 'var(--black)',
  },
  '& h1': { fontSize: '1.4rem' },
  '& h2': { fontSize: '1.2rem' },
  '& h3': { fontSize: '1.1rem' },
  '& blockquote': {
    borderLeft: `3px solid var(--grey-800)`,
    paddingLeft: '1rem',
    margin: '1.5rem 0',
    color: 'var(--black)',
  },
  '& pre': {
    backgroundColor: 'var(--black)',
    color: 'var(--white)',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    fontFamily: 'Roboto, sans-serif',
    margin: '1.5rem 0',
  },
  '& hr': {
    border: 'none',
    borderTop: `1px solid var(--gray-2)`,
    margin: '2rem 0',
  },
  '& a': {
    color: '#1d4ed8',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: '#1e40af', // Darker blue on hover
    },
    '&.mention': {
      fontWeight: theme.typography.fontWeightBold,
      color: "white",
      padding: '0.1em 0.2em',
      '&:hover': {
        borderRadius: '4px',
        backgroundColor: '#1e40af', // Darker blue background on hover
        color: "white",
      },
    },
  },
}));

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
      {...props}
      open={props.open}
      onClose={props.onClose}
      disableRestoreFocus
      maxWidth="lg"
    >
      <DialogTitle sx={{backgroundColor: colors.blueGrey[300], color: "black"}}>
        {props.title}
      </DialogTitle>
      <Box component="form" pb={1} sx={{backgroundColor: colors.blueGrey[300], color: "black", width: props.width || 600}}>
        {props.children}
      </Box>
    </Dialog>
  )
}

export function StyledFormDialog(props: React.PropsWithChildren<AnyProps>) {
  return (
    <StyledDialog
      {...props}
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
      onSubmit={props.onSubmit}
      title={props.title}
    >
      <DialogContent>
        <Stack spacing={2}>
          { props.children }
        </Stack>
      </DialogContent>
      <DialogActions>
        <SaveCancelButtons disabled={props.disabled || props.saving} onCancel={props.onCancel} />
      </DialogActions>
    </StyledDialog>
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
