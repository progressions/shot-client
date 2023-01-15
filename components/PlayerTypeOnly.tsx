import type { Character, CharacterType } from "../types/types"

interface PlayerTypeOnlyProps {
  character: Character
  only?: CharacterType | ChararacterType[]
  except?: CharacterType | CharacterType[]
  children: any
}

export default function PlayerTypeOnly({ character, only, children, except }: PlayerTypeOnlyProps) {
  if (only && [only].flat().includes(character.action_values["Type"])) {
    return children
  }
  if (except && ![except].flat().includes(character.action_values["Type"])) {
    return children
  }
  return (<></>)
}
