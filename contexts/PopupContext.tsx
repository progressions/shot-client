"use client"

import { Box } from "@mui/material"
import { useEffect, useCallback, useState, useRef } from "react"
import { Popup } from "@/components/popups"

interface PopupProviderProps {
  children: React.ReactNode
}

interface PopupInstance {
  instanceId: string
  anchorEl: HTMLElement | null
  position: { top: number, left: number } | null
  content: { id: string, className: string | null } | null
  isDimmed: boolean
  mentionId: string | null
  parentId: string | null
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [popups, setPopups] = useState<PopupInstance[]>([])
  const closeTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const isUndimmingRef = useRef<Map<string, boolean>>(new Map())
  const mouseoutHandlersRef = useRef<Map<string, (event: MouseEvent) => void>>(new Map())

  // Generate unique instance ID
  const generateInstanceId = () => `popup-${Date.now()}-${Math.random().toString(36).slice(2)}`

  // Calculate absolute position for popup
  const calculatePopperPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top + window.scrollY + 19,
      left: rect.left + window.scrollX
    }
  }

  // Check if popup has open children
  const hasOpenChildren = (instanceId: string) => {
    return popups.some(p => p.parentId === instanceId)
  }

  // Handle mouseover for links
  const handleMouseover = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement
    const mentionId = target.getAttribute("data-mention-id")
    const mentionClassName = target.getAttribute("data-mention-class-name")
    if (mentionId) {
      const instanceId = generateInstanceId()
      const parentPopup = target.closest("[data-popup-instance]")
      const parentId = parentPopup ? parentPopup.getAttribute("data-popup-instance") : null
      if (closeTimeoutsRef.current.has(instanceId)) {
        clearTimeout(closeTimeoutsRef.current.get(instanceId))
        closeTimeoutsRef.current.delete(instanceId)
      }
      isUndimmingRef.current.delete(instanceId)
      // Remove existing mouseout handler for this link
      const oldPopup = popups.find(p => p.mentionId === mentionId)
      if (oldPopup && mouseoutHandlersRef.current.has(oldPopup.instanceId)) {
        const oldHandler = mouseoutHandlersRef.current.get(oldPopup.instanceId)
        if (oldHandler && oldPopup.anchorEl) {
          oldPopup.anchorEl.removeEventListener("mouseout", oldHandler)
          mouseoutHandlersRef.current.delete(oldPopup.instanceId)
          console.log("POPUPS Removed old mouseout handler for:", oldPopup.instanceId)
        }
      }
      console.log("POPUPS Mouseover link:", { instanceId, mentionId, mentionClassName, parentId })
      setPopups((prev) => {
        let newPopups = prev
        if (prev.length >= 3) {
          const oldestId = prev[0].instanceId
          if (closeTimeoutsRef.current.has(oldestId)) {
            clearTimeout(closeTimeoutsRef.current.get(oldestId))
            closeTimeoutsRef.current.delete(oldestId)
          }
          if (mouseoutHandlersRef.current.has(oldestId)) {
            const handler = mouseoutHandlersRef.current.get(oldestId)
            const oldestPopup = prev.find(p => p.instanceId === oldestId)
            if (handler && oldestPopup?.anchorEl) {
              oldestPopup.anchorEl.removeEventListener("mouseout", handler)
              mouseoutHandlersRef.current.delete(oldestId)
            }
          }
          isUndimmingRef.current.delete(oldestId)
          console.log("POPUPS Removed oldest popup:", oldestId)
          newPopups = prev.slice(1)
        }
        newPopups = [
          ...newPopups,
          {
            instanceId,
            anchorEl: target,
            position: calculatePopperPosition(target),
            content: { id: mentionId, className: mentionClassName },
            isDimmed: false,
            mentionId,
            parentId
          }
        ]
        if (newPopups.length === 3) {
          newPopups = newPopups.map((popup, index) =>
            index === 0 ? { ...popup, isDimmed: true } : { ...popup, isDimmed: false }
          )
        }
        if (newPopups.length < 3 && newPopups.length > 0) {
          newPopups = newPopups.map((popup) => ({ ...popup, isDimmed: false }))
        }
        console.log("POPUPS New popups state:", newPopups.map(p => ({ instanceId: p.instanceId, mentionId: p.content?.id, isDimmed: p.isDimmed, parentId: p.parentId })))
        return newPopups
      })
    }
  }, [popups])

  // Handle mouse entering a popup
  const handlePopupMouseEnter = useCallback((instanceId: string) => {
    if (closeTimeoutsRef.current.has(instanceId)) {
      clearTimeout(closeTimeoutsRef.current.get(instanceId))
      closeTimeoutsRef.current.delete(instanceId)
    }
    console.log("POPUPS Mouse entered popup:", instanceId)
  }, [])

  // Handle mouse leaving a popup or link
  const handleMouseLeave = useCallback((instanceId: string, event: MouseEvent, isFromLink: boolean) => {
    const popup = popups.find((p) => p.instanceId === instanceId)
    if (!popup) {
      console.log("POPUPS No popup found for:", instanceId)
      return
    }
    const relatedTarget = event.relatedTarget
    const isOverLink = isFromLink ? false : relatedTarget instanceof Node && popup.anchorEl?.contains(relatedTarget)
    const isOverPopup = !isFromLink ? false : relatedTarget instanceof Node && document.querySelector(`[data-popup-instance="${instanceId}"]`)?.contains(relatedTarget)
    const hasChildren = hasOpenChildren(instanceId)

    console.log("POPUPS Mouse leave:", {
      instanceId,
      isFromLink,
      isOverLink,
      isOverPopup,
      hasChildren,
      relatedTarget: relatedTarget instanceof Node ? relatedTarget.nodeName : null
    })

    if (!isOverLink && !isOverPopup && !hasChildren) {
      if (closeTimeoutsRef.current.has(instanceId)) {
        clearTimeout(closeTimeoutsRef.current.get(instanceId))
        closeTimeoutsRef.current.delete(instanceId)
      }
      console.log("POPUPS Closing popup:", instanceId, "Reason: Mouse not over link, popup, or children")
      setPopups((prev) => {
        const newPopups = prev.filter((p) => p.instanceId !== instanceId)
        if (newPopups.length < 3 && newPopups.length > 0 && !isUndimmingRef.current.get("global")) {
          isUndimmingRef.current.set("global", true)
          console.log("POPUPS Un-dimming popups:", newPopups.map(p => p.instanceId))
          setTimeout(() => isUndimmingRef.current.delete("global"), 0)
          return newPopups.map((p) => ({ ...p, isDimmed: false }))
        } else if (isUndimmingRef.current.get("global")) {
          console.log("POPUPS Skipping un-dimming, already processed")
        }
        return newPopups
      })
    } else {
      console.log("POPUPS Keeping popup open:", { instanceId, isOverLink, isOverPopup, hasChildren })
    }
  }, [popups])

  // Handle document click to close all popups
  const handleDocumentClick = useCallback(() => {
    console.log("POPUPS Document clicked, closing all popups")
    closeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    closeTimeoutsRef.current.clear()
    isUndimmingRef.current.clear()
    mouseoutHandlersRef.current.forEach((handler, instanceId) => {
      const popup = popups.find(p => p.instanceId === instanceId)
      if (popup?.anchorEl) {
        popup.anchorEl.removeEventListener("mouseout", handler)
      }
    })
    mouseoutHandlersRef.current.clear()
    setPopups([])
  }, [popups])

  // Attach and clean up mouseout listeners dynamically
  useEffect(() => {
    const links = document.querySelectorAll("a[data-mention-id]")
    links.forEach((link) => {
      const mentionId = link.getAttribute("data-mention-id")
      const popup = popups.find((p) => p.mentionId === mentionId)
      if (popup) {
        const handler = (event: MouseEvent) => handleMouseLeave(popup.instanceId, event, true)
        if (link.getAttribute("data-mouseout-handler") !== handler.toString()) {
          const oldHandlerStr = link.getAttribute("data-mouseout-handler")
          if (oldHandlerStr) {
            const oldHandler = mouseoutHandlersRef.current.get(popup.instanceId)
            if (oldHandler) {
              // @ts-ignore
              link.removeEventListener("mouseout", oldHandler)
              console.log("POPUPS Removed old mouseout handler for:", popup.instanceId)
            }
          }
          // @ts-ignore
          link.addEventListener("mouseout", handler)
          link.setAttribute("data-mouseout-handler", handler.toString())
          mouseoutHandlersRef.current.set(popup.instanceId, handler)
          console.log("POPUPS Attached mouseout handler for:", popup.instanceId)
        }
      }
    })

    return () => {
      links.forEach((link) => {
        const mentionId = link.getAttribute("data-mention-id")
        const popup = popups.find((p) => p.mentionId === mentionId)
        if (popup && mouseoutHandlersRef.current.has(popup.instanceId)) {
          const handler = mouseoutHandlersRef.current.get(popup.instanceId)
          if (handler) {
            // @ts-ignore
            link.removeEventListener("mouseout", handler)
            mouseoutHandlersRef.current.delete(popup.instanceId)
            link.removeAttribute("data-mouseout-handler")
            console.log("POPUPS Cleaned up mouseout handler for:", popup.instanceId)
          }
        }
      })
    }
  }, [popups, handleMouseLeave])

  useEffect(() => {
    let links: NodeListOf<HTMLElement> | null = null
    let observer: MutationObserver | null = null
    let retryTimeout: NodeJS.Timeout | null = null

    const attachListeners = () => {
      links = document.querySelectorAll("a[data-mention-id]:not([data-listener-attached])")
      links.forEach((link) => {
        link.addEventListener("mouseover", handleMouseover)
        link.setAttribute("data-listener-attached", "true")
      })
      console.log("POPUPS Found links:", links.length)
    }

    attachListeners()

    observer = new MutationObserver(() => {
      attachListeners()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // @ts-ignore
    if (!links || links.length === 0) {
      retryTimeout = setTimeout(() => {
        console.log("POPUPS Retrying link detection...")
        attachListeners()
      }, 1000)
    }

    document.addEventListener("click", handleDocumentClick)

    return () => {
      if (links) {
        links.forEach((link) => {
          link.removeEventListener("mouseover", handleMouseover)
          link.removeAttribute("data-listener-attached")
        })
      }
      observer?.disconnect()
      if (retryTimeout) clearTimeout(retryTimeout)
      document.removeEventListener("click", handleDocumentClick)
      closeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      closeTimeoutsRef.current.clear()
      mouseoutHandlersRef.current.forEach((handler, instanceId) => {
        const popup = popups.find(p => p.instanceId === instanceId)
        if (popup?.anchorEl) {
          popup.anchorEl.removeEventListener("mouseout", handler)
        }
      })
      mouseoutHandlersRef.current.clear()
    }
  }, [handleMouseover, handleDocumentClick])

  return (
    <Box>
      {children}
      {popups.map((popup) => (
        <Popup
          key={popup.instanceId}
          instanceId={popup.instanceId}
          anchorEl={popup.anchorEl}
          position={popup.position || {top: 0, left: 0} }
          content={popup.content}
          isDimmed={popup.isDimmed}
          onMouseEnter={() => handlePopupMouseEnter(popup.instanceId)}
          // @ts-ignore
          onMouseLeave={(event: MouseEvent) => handleMouseLeave(popup.instanceId, event, false)}
        />
      ))}
    </Box>
  )
}
