import type { Character, CharacterType } from "../types/types"

interface PlayerTypeOnlyProps {
  character: Character
  type?: CharacterType
  except?: CharacterType
}

export default function PlayerTypeOnly({ character, type, children, except }) {
  if (type && character.action_values["Type"] === type) {
    return (
      children
    )
  }
  if (except && character.action_values["Type"] !== except) {
    return (
      children
    )
  }
  return (<></>)
}
