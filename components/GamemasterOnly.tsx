import type { User, Character } from "../types/types"

interface GamemasterOnlyProps {
  user: User,
  character: Character,
  children: any,
  override?: boolean,
}

const GamemasterOnly:React.FC<GamemasterOnlyProps> = ({ user, children, character, override }: GamemasterOnlyProps) => {
  if (character && ["PC", "Ally"].includes(character.action_values['Type'] as string)) {
    return children
  } else if (override || user?.gamemaster) {
    return children
  } else {
    return <></>
  }
}

export default GamemasterOnly
