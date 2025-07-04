import type { FightEvent } from "@/types/types"
import type { GroupedEvents, SequenceOnlyEvents, UngroupedEvents } from "@/components/fights/events/groupEvents"

export function formatEventsLog(
  groupedEvents: GroupedEvents,
  sequenceOnlyEvents: SequenceOnlyEvents,
  ungroupedEvents: UngroupedEvents
): string {
  const lines: string[] = []
  Object.keys(groupedEvents)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((sequence) => {
      lines.push(`Sequence ${sequence}`)
      lines.push("")
      if (sequenceOnlyEvents[Number(sequence)]) {
        sequenceOnlyEvents[Number(sequence)].forEach((event) => {
          lines.push(`  ${event.description}`)
        })
        lines.push("")
      }
      Object.keys(groupedEvents[Number(sequence)])
        .sort((a, b) => Number(b) - Number(a))
        .forEach((shot) => {
          lines.push(`Shot ${shot}`)
          groupedEvents[Number(sequence)][Number(shot)].forEach((event) => {
            lines.push(`  ${event.description}`)
          })
          lines.push("")
        })
    })
  Object.keys(sequenceOnlyEvents)
    .filter((seq) => !groupedEvents[Number(seq)])
    .sort((a, b) => Number(a) - Number(b))
    .forEach((sequence) => {
      lines.push(`Sequence ${sequence}`)
      lines.push("")
      sequenceOnlyEvents[Number(sequence)].forEach((event) => {
        lines.push(`  ${event.description}`)
      })
      lines.push("")
    })
  if (ungroupedEvents.length > 0) {
    if (lines.length > 0) lines.push("")
    lines.push("Ungrouped Events")
    lines.push("")
    ungroupedEvents.forEach((event) => {
      lines.push(`  ${event.description}`)
    })
  }
  return lines.length > 0 ? lines.join("\n") : "No events available."
}
