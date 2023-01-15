import type { Character, CharacterType } from "../types/types"

interface PlayerTypeOnlyProps {
  character: Character
  only?: CharacterType | CharacterType[]
  except?: CharacterType | CharacterType[]
  children: any
}

export default function PlayerTypeOnly({ character, only, children, except }: PlayerTypeOnlyProps) {
  if (only && [only].flat().includes(character.action_values["Type"] as CharacterType)) {
    return children
  }
  if (except && ![except].flat().includes(character.action_values["Type"] as CharacterType)) {
    return children
  }
  return (<></>)
}
