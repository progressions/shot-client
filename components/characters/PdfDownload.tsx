import { useState } from 'react'
import { useClient, useCharacter, useToast } from "@/contexts"
import { Tooltip, IconButton } from "@mui/material"
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DownloadingIcon from '@mui/icons-material/Downloading'

export default function PdfDownload() {
  const { client } = useClient()
  const { character } = useCharacter()
  const { toastError, toastSuccess } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  async function downloadPdf() {
    setIsDownloading(true)
    try {
      const filename = `${character.name.replace(/\s+/g, "_")}.pdf`

      const data = await client.getCharacterPdf(character)
      const pdfBlob = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toastSuccess("PDF downloaded successfully")
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toastError("Error downloading PDF")
    }
    setIsDownloading(false)
  }

  if (isDownloading) {
    return (
      <Tooltip title="Downloading PDF...">
        <IconButton disabled sx={{ml: 4, height: 35, width: 35}}>
          <DownloadingIcon color="primary" sx={{ fontSize: 35 }} />
        </IconButton>
      </Tooltip>
    )
  }
  return (
    <Tooltip title="Export PDF">
      <IconButton onClick={downloadPdf} sx={{ml: 4, height: 35, width: 35}}>
        <PictureAsPdfIcon color="primary" sx={{ fontSize: 35 }} />
      </IconButton>
    </Tooltip>
  )
}
