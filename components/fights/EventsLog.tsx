import { useFight } from "@/contexts/FightContext"
import { CancelButton, StyledDialog } from "@/components/StyledFields"
import { colors, Box, Button, DialogContent, Stack, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material"
import { useEffect, useState } from "react"
import type { Vehicle, Character, Fight, ShotType } from "@/types/types"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FES from "@/services/FightEventService"
import { useClient } from "@/contexts/ClientContext"

export default function EventsLog() {
  const { fight } = useFight()
  const { client } = useClient()

  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
    async function fetchEvents() {
      if (fight) {
        const events = await FES.getFightEvents(client, fight)
        setEvents(events)
      }
    }
    fetchEvents()
  }, [fight])

  function handleClick() {
    setProcessing(true)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setProcessing(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        disabled={processing}
        onClick={handleClick}
      >
        <MenuBookIcon />
      </Button>
      <StyledDialog open={open} onClose={handleClose} title="Events Log">
        <DialogContent sx={{mt: -3}}>
          <Stack spacing={1}>
            { events.map((event, index) => (
              <Typography key={index} variant="body2" color="black">
                {event.description}
              </Typography>
            ))}
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
