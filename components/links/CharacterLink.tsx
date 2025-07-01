import { Link } from "@mui/material"
import type { Character } from "@/types/types"
import CS from "@/services/CharacterService"
import styles from "@/components/editor/Editor.module.scss"

interface CharacterLinkProps {
  character: Character
  children?: React.ReactNode
}

export default function CharacterLink({ character, children }: CharacterLinkProps) {
  const href = CS.isVehicle(character) ? `/vehicles/${character.id}` : `/characters/${character.id}`
  const className = CS.isVehicle(character) ? "Vehicle" : "Character"

  return (
    <Link
      href={href}
      target="_blank"
      className={styles.inlineMention}
      data-mention-id={character.id}
      data-mention-class-name={className}
    >
      {children || character.name}
    </Link>
  )
}
