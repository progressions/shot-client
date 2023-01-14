import { createContext, useContext, useState } from "react"

import type { Toast } from "../types/types"
import { defaultToast } from "../types/types"

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState<Toast>(defaultToast)

  const closeToast = (): void => {
    setToast((prevToast: Toast) => { return { ...prevToast, open: false }})
  }

  return (
    <ToastContext.Provider value={{ toast, setToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
