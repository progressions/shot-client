import React from 'react'
import { Tooltip } from "@mui/material"

interface ButtonWithTooltipProps {
  icon: React.ReactElement | undefined
}

export default function ButtonWithTooltip({ icon }: ButtonWithTooltipProps) {
  if (!icon) {
    return (
      <>Mooks</>
    )
  }

  return (
    <Tooltip title="Mook Attacks" arrow>
      {icon}
    </Tooltip>
  )
}
