import { colors, Stack, Button, Dialog, DialogTitle, Box, DialogContent } from "@mui/material"

export function StyledDialog(props: any) {
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

export function CancelButton(props: any) {
  return (
    <Button variant="contained" color="secondary" {...props}>{ props.children ? props.children : "Cancel" }</Button>
  )
}

export function SaveButton(props: any) {
  return (
    <Button variant="contained" color="primary" type="submit" {...props}>{ props.children ? props.children : "Save" }</Button>
  )
}

export function SaveCancelButtons(props: any) {
  return (
    <Stack spacing={2} direction="row">
      <CancelButton disabled={props.disabled} onClick={props.onCancel}>{props.cancelText}</CancelButton>
      <SaveButton disabled={props.disabled}>{props.saveText}</SaveButton>
    </Stack>
  )
}
