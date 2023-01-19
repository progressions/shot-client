import { useState } from 'react'
import { Box, Paper, Container, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CampaignModal from './CampaignModal'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import type { Person, Campaign, Fight, ID } from "../../types/types"
import { defaultCampaign } from "../../types/types"

export default function CreateCampaign({ reload }: any) {
  const [newCampaign, setNewCampaign] = useState<Campaign>(defaultCampaign)

  const openModal = (): void => {
    setNewCampaign({...defaultCampaign, new: true})
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={openModal}>
        Create Campaign
      </Button>
      <CampaignModal open={newCampaign} setOpen={setNewCampaign} campaign={newCampaign as Campaign} reload={reload} />
    </>
  )
}
