import type { Character, CharacterType } from "@/types/types"
import CS from "@/services/CharacterService"

interface PlayerTypeOnlyProps {
  character: Character
  only?: CharacterType | CharacterType[]
  except?: CharacterType | CharacterType[]
}

export default function PlayerTypeOnly({ character, only, children, except }: React.PropsWithChildren<PlayerTypeOnlyProps>) {
  if (only && CS.isType(character, only)) {
    return (
      <>
        { children }
      </>
    )
  }
  if (except && !CS.isType(character, except)) {
    return (
      <>
        { children }
      </>
    )
  }
  return (<></>)
}
