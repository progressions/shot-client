import type { User, Character } from "../types/types"

interface GamemasterOnlyProps {
  user: User,
  character: Character,
  children: any
  override?: boolean,
}

export default function GamemasterOnly({ user, children, character, override }: GamemasterOnlyProps) {
  if (override || user?.gamemaster || ["PC", "Ally"].includes(character.action_values['Type'] as string)) {
    return children
  }
}
