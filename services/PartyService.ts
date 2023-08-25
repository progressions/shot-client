import type { Party } from "@/types/types"

const PartyService = {
  nameBadge: function(party: Party): string {
    return `${party?.name} ${this.rosterSummary(party)}`
  },

  rosterSummary: function(party: Party): string {
    const charactersCount = party?.characters?.length
    const vehiclesCount = party?.vehicles?.length

    if (!charactersCount && !vehiclesCount) {
      return ""
    }

    if (!charactersCount) {
      return `(${vehiclesCount} vehicles)`
    }

    if (!vehiclesCount) {
      return `(${charactersCount} characters)`
    }

    return `(${charactersCount} characters, ${vehiclesCount} vehicles)`
  },
}

export default PartyService
