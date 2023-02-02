import type { Campaign } from "../../types/types"
import { Stack, Button, Typography } from "@mui/material"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

interface NameDisplayProps {
  campaign: Campaign
  onClick: () => void
}

export default function NameDisplay({ campaign, onClick }: NameDisplayProps) {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="contained"
          startIcon={<PlayCircleIcon />}
          color="secondary"
          onClick={onClick}
        >
          Start
        </Button>
        <Typography>{campaign.title}</Typography>
      </Stack>
    </>
  )
}

