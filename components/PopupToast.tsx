import { Snackbar, Alert } from "@mui/material"
import type { Toast } from "../types/types"
import { useToast } from "../contexts/ToastContext"

export default function PopupToast() {
  const { toast, closeToast } = useToast()
  return (
    <Snackbar open={toast.open} onClose={closeToast} autoHideDuration={6000}>
      <Alert severity={toast.severity}>{toast.message}</Alert>
    </Snackbar>
  )
}
