import type { FightEvent } from "@/types/types"

export type GroupedEvents = Record<number, Record<number, FightEvent[]>>
export type SequenceOnlyEvents = Record<number, FightEvent[]>
export type UngroupedEvents = FightEvent[]

export interface EventGroups {
  groupedEvents: GroupedEvents
  sequenceOnlyEvents: SequenceOnlyEvents
  ungroupedEvents: UngroupedEvents
}

export function groupEvents(events: FightEvent[]): EventGroups {
  return events.reduce(
    (acc, event) => {
      if (event.details && 'sequence' in event.details) {
        const sequence = Number(event.details.sequence)
        if (!isNaN(sequence)) {
          if ('shot' in event.details) {
            const shot = Number(event.details.shot)
            if (!isNaN(shot)) {
              if (!acc.groupedEvents[sequence]) {
                acc.groupedEvents[sequence] = {}
              }
              if (!acc.groupedEvents[sequence][shot]) {
                acc.groupedEvents[sequence][shot] = []
              }
              acc.groupedEvents[sequence][shot].push(event)
              return acc
            }
          }
          if (!acc.sequenceOnlyEvents[sequence]) {
            acc.sequenceOnlyEvents[sequence] = []
          }
          acc.sequenceOnlyEvents[sequence].push(event)
          return acc
        }
      }
      acc.ungroupedEvents.push(event)
      return acc
    },
    {
      groupedEvents: {} as GroupedEvents,
      sequenceOnlyEvents: {} as SequenceOnlyEvents,
      ungroupedEvents: [] as UngroupedEvents
    }
  )
}
