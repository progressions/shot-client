"use client"

import { Paper, Box } from "@mui/material"
import styles from "@/components/popups/Popups.module.scss"
import type { CharacterType } from "@/types/types"
import { JuncturePopup, CharacterEffectsPopup, SchticksPopup, SkillsPopup, WeaponsPopup, CharacterPopup, VehiclePopup, FactionPopup, TypePopup, ArchetypePopup, WeaponPopup, SchtickPopup, PartyPopup, SitePopup } from "@/components/popups"
import { MouseEvent } from "react"

interface PopupBaseProps {
  instanceId: string
  anchorEl: HTMLElement | null
  position: { top: number, left: number }
  content: { id: string, className: string | null, data: any } | null
  isDimmed: boolean
  onMouseEnter: () => void
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void // Use React's MouseEvent
}

export default function PopupBase({ instanceId, position, content, isDimmed, onMouseEnter, onMouseLeave }: PopupBaseProps) {
  const classNames = [styles.mentionPopup, isDimmed ? styles.dimmed : ""].filter(Boolean).join(" ")
  const data = content?.data ? JSON.parse(content.data) : null

  if (!content) return null

  const renderPopupContent = () => {
    switch (content.className) {
      case "Character":
        return <CharacterPopup id={content.id} data={data} />
      case "Vehicle":
        return <VehiclePopup id={content.id} data={data} />
      case "Faction":
        return <FactionPopup id={content.id} data={data} />
      case "Type":
        return <TypePopup id={content.id as CharacterType} data={data} />
      case "Archetype":
        return <ArchetypePopup id={content.id} data={data} />
      case "Weapon":
        return <WeaponPopup id={content.id} data={data} />
      case "Schtick":
        return <SchtickPopup id={content.id} data={data} />
      case "Party":
        return <PartyPopup id={content.id} data={data} />
      case "Site":
        return <SitePopup id={content.id} data={data} />
      case "Weapons":
        return <WeaponsPopup id={content.id} data={data} />
      case "Skills":
        return <SkillsPopup id={content.id} data={data} />
      case "Schticks":
        return <SchticksPopup id={content.id} data={data} />
      case "CharacterEffects":
        return <CharacterEffectsPopup id={content.id} data={data} />
      case "Juncture":
        return <JuncturePopup id={content.id} data={data} />
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
