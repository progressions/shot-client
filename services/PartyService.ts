import type { Party } from "../types/types"

const PartyService = {
  nameBadge: function(party: Party): string {
    return `${party?.name} ${this.rosterSummary(party)}`
  },

  rosterSummary: function(party: Party): string {
    const charactersCount = party?.characters?.length
    const vehiclesCount = party?.vehicles?.length
    const charactersLabel = charactersCount === 1 ? `${charactersCount} character` : `${charactersCount} characters`
    const vehiclesLabel = vehiclesCount === 1 ? `${vehiclesCount} vehicle` : ` ${vehiclesCount} vehicles`
    const comma = charactersCount && vehiclesCount ? ", " : ""
    const openingParenthesis = charactersCount || vehiclesCount ? " (" : ""
    const closingParenthesis = charactersCount || vehiclesCount ? ")" : ""

    return `${openingParenthesis}${charactersCount ? charactersLabel : ""}${comma}${vehiclesCount ? vehiclesLabel : ""}${closingParenthesis}`
  },
}

export default PartyService
