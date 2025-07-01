import { Box, Typography, Stack } from "@mui/material"
import styles from "@/components/editor/Editor.module.scss"
import type { Character, User } from "@/types/types"
import { defaultCharacter } from "@/types/types"
import Client from "@/utils/Client"
import { useState, useEffect } from "react"
import CS from "@/services/CharacterService"
import { ArchetypePopup, TypePopup, WeaponPopup, SchtickPopup, FactionPopup, PartyPopup, SitePopup, CharacterPopup, VehiclePopup } from "@/components/popups"

interface PopupProps {
  mentionId: string
  mentionClass: string
  user: User | null // Allow user to be nullable
  client: Client
}

export default function Popup({
  user,
  client,
  mentionId,
  mentionClass,
}: PopupProps) {
  switch (mentionClass) {
    case "Character":
      return (
        <CharacterPopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Vehicle":
      return (
        <VehiclePopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Site":
      return (
        <SitePopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Party":
      return (
        <PartyPopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Faction":
      return (
        <FactionPopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Schtick":
      return (
        <SchtickPopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Weapon":
      return (
        <WeaponPopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Type":
      return (
        <TypePopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    case "Archetype":
      return (
        <ArchetypePopup
          user={user}
          client={client}
          mentionId={mentionId}
          mentionClass={mentionClass}
        />
      )
    // Add more cases for different popup types if needed
    default:
      return null // Or a default popup component
  }
}
