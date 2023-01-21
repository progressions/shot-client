import { createContext, useContext, useState } from "react"

import type { Toast } from "../types/types"
import { defaultToast } from "../types/types"

const ToastContext = createContext({})

export function ToastProvider({ children }: any) {
  const [toast, setToast] = useState<Toast>(defaultToast)

  const toastSuccess = (message: string) => {
    setToast({ open: true, message: message, severity: "success" })
  }

  const toastError = (message = "There was an error.") => {
    setToast({ open: true, message: message, severity: "error" })
  }

  const toastInfo = (message: string) => {
    setToast({ open: true, message: message, severity: "info" })
  }

  const toastWarning = (message: string) => {
    setToast({ open: true, message: message, severity: "warning" })
  }

  const closeToast = (): void => {
    setToast((prevToast: Toast) => { return { ...prevToast, open: false }})
  }

  return (
    <ToastContext.Provider value={{ toast, setToast, closeToast, toastSuccess, toastError, toastInfo, toastWarning }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): any {
  return useContext(ToastContext)
}
