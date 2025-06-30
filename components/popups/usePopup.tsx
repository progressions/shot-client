import { useRef, useEffect } from "react"
import tippy, { Instance } from "tippy.js"
import ReactDOM from "react-dom/client"
import { Popup } from "@/components/popups"
import type { User } from "@/types/types"
import Client from "@/utils/Client"

interface PopupProps {
  containerRef: React.RefObject<HTMLElement>
  user: User | null
  client: Client
}

interface TriggerPopupParams {
  mentionId: string
  mentionClass: string
  target: TippyHTMLElement
}

export function usePopup({ containerRef, user, client }: PopupProps) {
  const tippyInstancesRef = useRef<Instance[]>([])
  const nestedTippyRefs = useRef<Map<string, Instance>>(new Map())

  const closeAllTippyInstances = () => {
    console.log("Closing all Tippy instances:", tippyInstancesRef.current.length)
    tippyInstancesRef.current.forEach((instance) => {
      setTimeout(() => instance.destroy(), 0)
    })
    tippyInstancesRef.current = []
    nestedTippyRefs.current.clear()
  }

  const createNestedTippy = (link: TippyHTMLElement, nestedMentionId: string, nestedMentionClass: string, depth: number = 1) => {
    const tippyKey = `${nestedMentionId}-${depth}`
    if (link._tippy) {
      link._tippy.destroy()
      nestedTippyRefs.current.delete(tippyKey)
    }
    console.log(`Creating nested Tippy (depth ${depth}) for:`, { nestedMentionId, nestedMentionClass })
    const nestedContainer = document.createElement("div")
    const nestedRoot = ReactDOM.createRoot(nestedContainer)
    nestedRoot.render(
      <Popup user={user} client={client} mentionId={nestedMentionId} mentionClass={nestedMentionClass} />
    )
    let observer: MutationObserver | null = null
    let hideTimeout: NodeJS.Timeout | null = null

    const nestedTippy = tippy(link, {
      content: nestedContainer,
      interactive: true,
      trigger: "manual",
      placement: "right",
      appendTo: () => document.body,
      allowHTML: true,
      delay: [200, 0],
      onShow(instance) {
        console.log(`Nested popup shown (depth ${depth}) for:`, { nestedMentionId })
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const deeperLinks = nestedContainer.querySelectorAll("a[data-mention-id]")
            console.log(`Deeper nested links found (depth ${depth + 1}):`, deeperLinks.length, mutation)
            console.log("Nested container HTML:", nestedContainer.innerHTML.substring(0, 100))
            deeperLinks.forEach((deeperLink) => {
              const deeperMentionId = deeperLink.getAttribute("data-mention-id") || ""
              const deeperMentionClass = deeperLink.getAttribute("data-mention-class-name") || ""
              createNestedTippy(deeperLink as TippyHTMLElement, deeperMentionId, deeperMentionClass, depth + 1)
            })
          })
        })
        observer.observe(nestedContainer, { childList: true, subtree: true })
        setTimeout(() => {
          const deeperLinks = nestedContainer.querySelectorAll("a[data-mention-id]")
          console.log(`Fallback check - Deeper nested links found (depth ${depth + 1}):`, deeperLinks.length)
          console.log("Fallback nested container HTML:", nestedContainer.innerHTML.substring(0, 100))
          deeperLinks.forEach((deeperLink) => {
            const deeperMentionId = deeperLink.getAttribute("data-mention-id") || ""
            const deeperMentionClass = deeperLink.getAttribute("data-mention-class-name") || ""
            createNestedTippy(deeperLink as TippyHTMLElement, deeperMentionId, deeperMentionClass, depth + 1)
          })
        }, 500)

        // Add event listeners to the popup content
        const popupContent = instance.popper.querySelector(".tippy-box") as HTMLElement
        const showPopupContent = () => {
          console.log(`Mouseenter popup content (depth ${depth}) for:`, { nestedMentionId })
          if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
          }
        }
        const scheduleHidePopup = () => {
          console.log(`Mouseleave popup content (depth ${depth}) for:`, { nestedMentionId })
          if (hideTimeout) clearTimeout(hideTimeout)
          hideTimeout = setTimeout(() => {
            instance.hide()
          }, 500)
        }
        popupContent.addEventListener("mouseenter", showPopupContent)
        popupContent.addEventListener("mouseleave", scheduleHidePopup)
      },
      onHide(instance) {
        const popupContent = instance.popper.querySelector(".tippy-box") as HTMLElement
        const showPopupContent = () => {
          console.log(`Mouseenter popup content (depth ${depth}) for:`, { nestedMentionId })
          if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
          }
        }
        const scheduleHidePopup = () => {
          console.log(`Mouseleave popup content (depth ${depth}) for:`, { nestedMentionId })
          if (hideTimeout) clearTimeout(hideTimeout)
          hideTimeout = setTimeout(() => {
            instance.hide()
          }, 500)
        }
        popupContent.removeEventListener("mouseenter", showPopupContent)
        popupContent.removeEventListener("mouseleave", scheduleHidePopup)
        if (hideTimeout) clearTimeout(hideTimeout)
        setTimeout(() => {
          nestedRoot.unmount()
          nestedContainer.remove()
          if (observer) {
            observer.disconnect()
            console.log(`Nested popup hidden (depth ${depth}) for:`, { nestedMentionId })
          }
        }, 0)
      },
      onDestroy(instance) {
        link.removeEventListener("mouseenter", showPopup)
        if (hideTimeout) clearTimeout(hideTimeout)
      },
    })

    tippyInstancesRef.current.push(nestedTippy)
    nestedTippyRefs.current.set(tippyKey, nestedTippy)

    const showPopup = () => {
      console.log(`Mouseenter link (depth ${depth}) for:`, { nestedMentionId })
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }
      if (link._tippy) link._tippy.show()
    }

    link.addEventListener("mouseenter", showPopup)
  }

  const triggerPopup = ({ mentionId, mentionClass, target }: TriggerPopupParams) => {
    console.log("Triggering popup for:", { mentionId, mentionClass })
    const container = document.createElement("div")
    const root = ReactDOM.createRoot(container)
    root.render(<Popup user={user} client={client} mentionId={mentionId} mentionClass={mentionClass} />)

    let observer: MutationObserver | null = null
    let hideTimeout: NodeJS.Timeout | null = null

    const tippyInstance = tippy(target, {
      content: container,
      showOnCreate: true,
      interactive: true,
      trigger: "manual",
      placement: "bottom-start",
      appendTo: () => document.body,
      allowHTML: true,
      onShow(instance) {
        console.log("Parent popup shown, initializing nested tooltips")
        observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const nestedLinks = container.querySelectorAll("a[data-mention-id]")
            console.log("Nested links found in mutation (depth 1):", nestedLinks.length, mutation)
            console.log("Parent container HTML:", container.innerHTML.substring(0, 100))
            nestedLinks.forEach((link) => {
              const nestedMentionId = link.getAttribute("data-mention-id") || ""
              const nestedMentionClass = link.getAttribute("data-mention-class-name") || ""
              createNestedTippy(link as TippyHTMLElement, nestedMentionId, nestedMentionClass, 1)
            })
          })
        })
        observer.observe(container, { childList: true, subtree: true })
        setTimeout(() => {
          const nestedLinks = container.querySelectorAll("a[data-mention-id]")
          console.log("Fallback check - Nested links found (depth 1):", nestedLinks.length)
          console.log("Fallback parent container HTML:", container.innerHTML.substring(0, 100))
          nestedLinks.forEach((link) => {
            const nestedMentionId = link.getAttribute("data-mention-id") || ""
            const nestedMentionClass = link.getAttribute("data-mention-class-name") || ""
            createNestedTippy(link as TippyHTMLElement, nestedMentionId, nestedMentionClass, 1)
          })
        }, 500)

        // Add event listeners to the popup content
        const popupContent = instance.popper.querySelector(".tippy-box") as HTMLElement
        const showPopupContent = () => {
          console.log("Mouseenter popup content for parent popup:", { mentionId })
          if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
          }
        }
        const scheduleHidePopup = () => {
          console.log("Mouseleave popup content for parent popup:", { mentionId })
          if (hideTimeout) clearTimeout(hideTimeout)
          hideTimeout = setTimeout(() => {
            instance.hide()
          }, 500)
        }
        popupContent.addEventListener("mouseenter", showPopupContent)
        popupContent.addEventListener("mouseleave", scheduleHidePopup)
      },
      onHide(instance) {
        const popupContent = instance.popper.querySelector(".tippy-box") as HTMLElement
        const showPopupContent = () => {
          console.log("Mouseenter popup content for parent popup:", { mentionId })
          if (hideTimeout) {
            clearTimeout(hideTimeout)
            hideTimeout = null
          }
        }
        const scheduleHidePopup = () => {
          console.log("Mouseleave popup content for parent popup:", { mentionId })
          if (hideTimeout) clearTimeout(hideTimeout)
          hideTimeout = setTimeout(() => {
            instance.hide()
          }, 500)
        }
        popupContent.removeEventListener("mouseenter", showPopupContent)
        popupContent.removeEventListener("mouseleave", scheduleHidePopup)
        if (hideTimeout) clearTimeout(hideTimeout)
        setTimeout(() => {
          root.unmount()
          container.remove()
          if (observer) {
            observer.disconnect()
            console.log("Parent popup hidden, observer disconnected")
          }
        }, 0)
      },
      onDestroy(instance) {
        target.removeEventListener("mouseenter", showPopup)
        if (hideTimeout) clearTimeout(hideTimeout)
      },
    })

    tippyInstancesRef.current.push(tippyInstance)

    const showPopup = () => {
      console.log("Mouseenter target for parent popup:", { mentionId })
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }
      if (target._tippy) target._tippy.show()
    }

    target.addEventListener("mouseenter", showPopup)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlers: Array<{ link: TippyHTMLElement; handler: (event: MouseEvent) => void }> = []
    let parentObserver: MutationObserver | null = null

    const updateParentLinks = () => {
      const links = container.querySelectorAll("a[data-mention-id]:not(.tippy-box a)")
      console.log("Found parent links:", links.length)
      console.log("Parent container HTML:", container.innerHTML.substring(0, 100))
      handlers.forEach(({ link, handler }) => link.removeEventListener("mouseover", handler))
      handlers.length = 0
      links.forEach((link) => {
        const mentionId = link.getAttribute("data-mention-id") || ""
        const mentionClass = link.getAttribute("data-mention-class-name") || ""
        const handler = (event: MouseEvent) => {
          triggerPopup({ mentionId, mentionClass, target: event.target as TippyHTMLElement })
        }
        (link as TippyHTMLElement).addEventListener("mouseover", handler)
        handlers.push({ link: link as TippyHTMLElement, handler })
      })
    }

    updateParentLinks()
    parentObserver = new MutationObserver(() => {
      console.log("Parent container mutated, updating links")
      updateParentLinks()
    })
    parentObserver.observe(container, { childList: true, subtree: true })

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!container?.contains(target) && !target.closest(".tippy-box")) {
        console.log("Document click outside, closing all popups")
        closeAllTippyInstances()
      }
    }
    document.addEventListener("click", handleDocumentClick)

    return () => {
      handlers.forEach(({ link, handler }) => link.removeEventListener("mouseover", handler))
      document.removeEventListener("click", handleDocumentClick)
      if (parentObserver) parentObserver.disconnect()
      closeAllTippyInstances()
    }
  }, [user, client])

  return { triggerPopup }
}
