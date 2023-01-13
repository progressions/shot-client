import type { Character, CharacterType } from "../types/types"

interface PlayerTypeOnlyProps {
  character: Character
  type?: CharacterType
  except?: CharacterType
  children: any
}

export default function PlayerTypeOnly({ character, type, children, except }: PlayerTypeOnlyProps) {
  if (type && character.action_values["Type"] === type) {
    return children
  }
  if (except && character.action_values["Type"] !== except) {
    return children
  }
  return (<></>)
}
