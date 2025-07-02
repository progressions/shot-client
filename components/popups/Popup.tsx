"use client"

import { Paper, Box } from "@mui/material"
import styles from "@/components/popups/Popups.module.scss"
import type { CharacterType } from "@/types/types"
import { CharacterPopup, VehiclePopup, FactionPopup, TypePopup, ArchetypePopup, WeaponPopup, SchtickPopup, PartyPopup, SitePopup } from "@/components/popups"
import { MouseEvent } from "react"

interface PopupProps {
  instanceId: string
  anchorEl: HTMLElement | null
  position: { top: number, left: number }
  content: { id: string, className: string | null } | null
  isDimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void // Use React's MouseEvent
}

export default function Popup({ instanceId, position, content, isDimmed, onMouseEnter, onMouseLeave }: PopupProps) {
  const classNames = [styles.mentionPopup, isDimmed ? styles.dimmed : ""].filter(Boolean).join(" ")

  if (!content) return null

  const renderPopupContent = () => {
    switch (content.className) {
      case "Character":
        return <CharacterPopup id={content.id} />
      case "Vehicle":
        return <VehiclePopup id={content.id} />
      case "Faction":
        return <FactionPopup id={content.id} />
      case "Type":
        return <TypePopup id={content.id as CharacterType} />
      case "Archetype":
        return <ArchetypePopup id={content.id} />
      case "Weapon":
        return <WeaponPopup id={content.id} />
      case "Schtick":
        return <SchtickPopup id={content.id} />
      case "Party":
        return <PartyPopup id={content.id} />
      case "Site":
        return <SitePopup id={content.id} />
      default:
        return null
    }
  }

  return (
    <Box
      component="div"
      data-popup-instance={instanceId}
      sx={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1300,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Paper
        className={classNames}
        sx={{
          p: 1,
          maxWidth: 300,
          bgcolor: "grey.900",
          color: "white",
          boxShadow: 3,
        }}
      >
        {renderPopupContent()}
      </Paper>
    </Box>
  )
}
