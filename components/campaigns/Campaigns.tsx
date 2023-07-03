import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Link, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'

import { useToast } from "../../contexts/ToastContext"
import { useCampaign } from "../../contexts/CampaignContext"
import { useClient } from "../../contexts/ClientContext"

import type { Campaign } from "../../types/types"

interface CampaignsProps {
  campaigns: Campaign[]
  getCampaigns: () => Promise<void>
}

export default function Campaigns({ campaigns, getCampaigns }: CampaignsProps) {
  const { toastError, toastSuccess } = useToast()
  const { client, user } = useClient()
  const { campaign:currentCampaign, getCurrentCampaign, setCurrentCampaign } = useCampaign()

  const deleteCampaign = async (campaign: Campaign) => {
    const confirmation = confirm("Delete campaign? This cannot be undone.")
    if (confirmation) {
      try {
        await client.deleteCampaign(campaign)
        toastSuccess(`${campaign.name} deleted.`)
        await getCampaigns()
      } catch(error) {
        toastError()
      }
    }
  }

  const startCampaign = async (camp: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      toastSuccess(`${camp.name} activated`)
    } else {
      toastSuccess(`Campaign cleared`)
    }
    await getCampaigns()
    return ""
  }

  const startStopCampaignButton = (campaign: Campaign, current: Campaign | null) => {
    if (campaign.id === current?.id) {
      return (
        <IconButton color="primary" onClick={() => startCampaign(null)}>
          <StopCircleIcon />
        </IconButton>
      )
    }
    return (
      <IconButton color="primary" onClick={() => startCampaign(campaign)}>
        <PlayCircleIcon />
      </IconButton>
    )
  }

  return (
    <TableContainer component={Paper} sx={{marginTop: 3}}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Campaign</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            campaigns.map((campaign: Campaign) => {
              return (
                <TableRow key={campaign.id}>
                  <TableCell sx={{width: 400}}>
                    <Typography variant="h6">
                      <Link color="text.primary" href={`/campaigns/${campaign.id}`}>
                        {campaign.name}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{width: 100}}>
                    { startStopCampaignButton(campaign, currentCampaign) }
                    { campaign?.gamemaster?.id === user?.id &&
                    <IconButton color="primary" onClick={() => deleteCampaign(campaign)}>
                      <DeleteIcon />
                    </IconButton> }
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}
