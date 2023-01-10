import { Snackbar, Alert } from "@mui/material"
import type { Toast } from "../types/types"

interface ToastParams {
  toast: Toast,
  closeToast: () => void
}

export default function PopupToast({ toast, closeToast }: ToastParams) {
  return (
    <Snackbar open={toast.open} onClose={closeToast} autoHideDuration={6000}>
      <Alert severity={toast.severity}>{toast.message}</Alert>
    </Snackbar>
  )
}
