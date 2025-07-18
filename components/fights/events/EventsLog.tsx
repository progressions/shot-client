import { useFight } from "@/contexts/FightContext"
import { CancelButton, StyledDialog } from "@/components/StyledFields"
import { Box, Button, DialogContent, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import type { FightEvent, Vehicle, Character, Fight, ShotType } from "@/types/types"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FES from "@/services/FightEventService"
import { useClient, useLocalStorage } from "@/contexts"
import { groupEvents, type GroupedEvents, type SequenceOnlyEvents, type UngroupedEvents } from "@/components/fights/events/groupEvents"
import { formatEventsLog } from "@/components/fights/events/formatEventsLog"

// Type definitions
interface EventItemProps {
  event: FightEvent
}

interface ShotGroupProps {
  shot: string
  events: FightEvent[]
}

interface SequenceGroupProps {
  sequence: string
  shots: Record<number, FightEvent[]>
  sequenceEvents: FightEvent[]
}

// Component to render a single event description
function EventItem({ event }: EventItemProps) {
  return (
    <Typography variant="body2" color="black">
      {event.description}
    </Typography>
  )
}

// Component to render a shot with its events
function ShotGroup({ shot, events }: ShotGroupProps) {
  return (
    <Box>
      <Typography variant="subtitle1" color="black">
        Shot {shot}
      </Typography>
      <Stack spacing={0.5} sx={{ ml: 2 }}>
        {events.map((event, index) => (
          <EventItem key={index} event={event} />
        ))}
      </Stack>
    </Box>
  )
}

// Component to render a sequence with its events and shots
function SequenceGroup({ sequence, shots, sequenceEvents }: SequenceGroupProps) {
  return (
    <Box>
      <Typography variant="h6" color="black">
        Sequence {sequence}
      </Typography>
      <Stack spacing={1} sx={{ ml: 2 }}>
        {sequenceEvents.length > 0 && (
          <Stack spacing={0.5}>
            {sequenceEvents.map((event, index) => (
              <EventItem key={index} event={event} />
            ))}
          </Stack>
        )}
        {Object.keys(shots)
          .sort((a, b) => Number(b) - Number(a)) // Sort shots in descending order
          .map((shot) => (
            <ShotGroup key={shot} shot={shot} events={shots[Number(shot)]} />
          ))}
      </Stack>
    </Box>
  )
}

export default function EventsLog() {
  const { fight } = useFight()
  const { client } = useClient()

  const [processing, setProcessing] = useState(false)
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<FightEvent[]>([])
  const { getLocally, saveLocally } = useLocalStorage()

  useEffect(() => {
    async function fetchEvents() {
      // Check if events are already cached
      const cachedEvents = getLocally(`fight-events-${fight.id}`)
      console.log("cachedEvents:", cachedEvents)
      if (cachedEvents) {
        console.log("Using cached events for fight:", fight.id)
        setEvents(cachedEvents as FightEvent[])
        return
      }
      console.log("Fetching events for fight:", fight.id)
      const events = await FES.getFightEvents(client, fight)
      // Save fetched events to local storage
      saveLocally(`fight-events-${fight.id}`, events)
      setEvents(events || [])
    }
    if (fight?.id) {
      fetchEvents().catch(error => {
        console.error("Error fetching fight events:", error)
      })
    }
  }, [fight])

  function handleClick() {
    setProcessing(true)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setProcessing(false)
  }

  // Group events
  const { groupedEvents, sequenceOnlyEvents, ungroupedEvents } = groupEvents(events)

  // Copy events log to clipboard
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatEventsLog(groupedEvents, sequenceOnlyEvents, ungroupedEvents))
      alert("Events log copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy events log:", error)
      alert("Failed to copy events log. Please try again.")
    }
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
        <DialogContent sx={{ mt: -3 }}>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ alignSelf: "flex-start" }}
            >
              Copy to Clipboard
            </Button>
            {Object.keys(groupedEvents)
              .sort((a, b) => Number(a) - Number(b))
              .map((sequence) => (
                <SequenceGroup
                  key={sequence}
                  sequence={sequence}
                  shots={groupedEvents[Number(sequence)]}
                  sequenceEvents={sequenceOnlyEvents[Number(sequence)] || []}
                />
              ))}
            {Object.keys(sequenceOnlyEvents)
              .filter((seq) => !groupedEvents[Number(seq)])
              .sort((a, b) => Number(a) - Number(b))
              .map((sequence) => (
                <SequenceGroup
                  key={sequence}
                  sequence={sequence}
                  shots={{}}
                  sequenceEvents={sequenceOnlyEvents[Number(sequence)]}
                />
              ))}
            {ungroupedEvents.length > 0 && (
              <Box>
                <Stack spacing={0.5} sx={{ ml: 2 }}>
                  {ungroupedEvents.map((event, index) => (
                    <EventItem key={index} event={event} />
                  ))}
                </Stack>
              </Box>
            )}
            {Object.keys(groupedEvents).length === 0 &&
              Object.keys(sequenceOnlyEvents).length === 0 &&
              ungroupedEvents.length === 0 && (
                <Typography variant="body2" color="black">
                  No events available.
                </Typography>
              )}
          </Stack>
        </DialogContent>
      </StyledDialog>
    </>
  )
}
