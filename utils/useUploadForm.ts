import { useState } from "react"
import axios from "axios"
import { useClient } from "@/contexts/ClientContext"

export const useUploadForm = (url: string) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { client, jwt } = useClient()

  const uploadForm = async (formData: FormData) => {
    setIsLoading(true)
    await axios.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': jwt
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 50
        setProgress(progress)
      },
      onDownloadProgress: (progressEvent) => {
        const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50
        setProgress(progress)
      },
    })
    setIsSuccess(true)
  }

  return { uploadForm, isSuccess, progress }
}
