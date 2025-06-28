import dynamic from "next/dynamic"
import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import { Editor as TiptapEditor, EditorProvider, useCurrentEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Mention from "@tiptap/extension-mention"
import { Button, ButtonGroup } from "@mui/material"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"
import styles from "./Editor.module.scss"
import { useState, useRef, useEffect } from "react"
import { Transaction } from "@tiptap/pm/state"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import { PluginKey } from "@tiptap/pm/state"
import { SuggestionOptions } from "@tiptap/suggestion"
import { useClient } from "@/contexts"

interface EditorProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
}

interface MentionItem {
  id: string
  label: string
}

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    console.log('MenuBar: No editor instance')
    return null
  }

  return (
    <div className={styles.controlGroup}>
      <ButtonGroup className={styles.buttonGroup} variant="outlined" size="small">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.isActive : ''}
        >
          <FormatBoldIcon />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.isActive : ''}
        >
          <FormatItalicIcon />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? styles.isActive : ''}
        >
          P
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}
        >
          H1
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}
        >
          H3
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? styles.isActive : ''}
        >
          H4
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? styles.isActive : ''}
        >
          H5
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? styles.isActive : ''}
        >
          H6
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styles.isActive : ''}
        >
          <FormatListBulletedIcon />
        </Button>
      </ButtonGroup>
    </div>
  )
}

const fetchSuggestions = async (query: string, client: any): Promise<MentionItem[]> => {
  try {
    const data = await client.getSuggestions({ query })
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
}

const Editor = ({ value, onChange, name = 'description' }: EditorProps) => {
  const { client } = useClient()
  const [content, setContent] = useState<string>(value)
  const [isSuggestionActive, setIsSuggestionActive] = useState<boolean>(false)
  const suggestionContainerRef = useRef<HTMLElement | null>(null)
  const suggestionPropsRef = useRef<{ props: any; command: (item: MentionItem) => void } | null>(null)
  const focusedIndexRef = useRef<number>(-1)
  const editorRef = useRef<TiptapEditor | null>(null)
  const popupRef = useRef<any>(null)

  const updateFocus = (container: HTMLElement, newIndex: number, items: MentionItem[]) => {
    console.log('Updating focus to index:', newIndex)
    focusedIndexRef.current = newIndex
    const buttons = container.querySelectorAll(`button.${styles.mentionItem}`)
    buttons.forEach((button, index) => {
      if (index === focusedIndexRef.current) {
        button.classList.add(styles.focused)
        button.scrollIntoView({ block: 'nearest' })
        setTimeout(() => {
          button.focus()
          console.log('Focused button:', button.textContent, 'Document active element:', document.activeElement?.textContent)
        }, 0)
      } else {
        button.classList.remove(styles.focused)
      }
    })
  }

  // Ensure focus is maintained on the popup
  useEffect(() => {
    if (isSuggestionActive && suggestionContainerRef.current) {
      const buttons = suggestionContainerRef.current.querySelectorAll(`button.${styles.mentionItem}`)
      if (buttons.length > 0 && focusedIndexRef.current >= 0) {
        buttons[focusedIndexRef.current].focus()
        console.log('useEffect: Focused button:', buttons[focusedIndexRef.current].textContent, 'activeElement:', document.activeElement?.textContent)
      }
    }
  }, [isSuggestionActive])

  // Fallback keydown listener for the container
  useEffect(() => {
    const container = suggestionContainerRef.current
    if (!container || !isSuggestionActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Container keydown:', e.key, 'focusedIndex:', focusedIndexRef.current, 'activeElement:', document.activeElement?.textContent)
      if (!suggestionPropsRef.current) return
      const { props, command } = suggestionPropsRef.current
      e.preventDefault()
      e.stopPropagation()

      if (e.key === 'Escape') {
        console.log('Hiding popup on Escape')
        suggestionPropsRef.current?.props.editor.commands.focus()
        popupRef.current?.[0]?.hide()
        popupRef.current?.[0]?.destroy()
        focusedIndexRef.current = -1
        setIsSuggestionActive(false)
        return
      }

      if (e.key === 'ArrowDown') {
        const newIndex = focusedIndexRef.current < props.items.length - 1 ? focusedIndexRef.current + 1 : 0
        updateFocus(container, newIndex, props.items)
        return
      }

      if (e.key === 'ArrowUp') {
        const newIndex = focusedIndexRef.current > 0 ? focusedIndexRef.current - 1 : props.items.length - 1
        updateFocus(container, newIndex, props.items)
        return
      }

      if (e.key === 'Enter' && focusedIndexRef.current >= 0 && focusedIndexRef.current < props.items.length) {
        const item = props.items[focusedIndexRef.current]
        console.log('Container selecting item:', item)
        command({ id: item.id, label: item.label })
        suggestionPropsRef.current?.props.editor.commands.focus()
        console.log('Hiding popup on Enter')
        popupRef.current?.[0]?.hide()
        popupRef.current?.[0]?.destroy()
        setIsSuggestionActive(false)
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
        return
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isSuggestionActive])

  const suggestion: SuggestionOptions['suggestion'] = {
    char: '@',
    pluginKey: new PluginKey('mention'),
    items: async ({ query }) => {
      return await fetchSuggestions(query, client)
    },
    render: () => {
      return {
        onStart: (props) => {
          console.log('Suggestion onStart:', props)
          setIsSuggestionActive(true)
          suggestionPropsRef.current = { props, command: props.command }
          editorRef.current = props.editor
          const container = document.createElement('div')
          container.className = styles.mentionSuggestions
          container.setAttribute('tabindex', '0')
          container.setAttribute('role', 'listbox')
          suggestionContainerRef.current = container
          props.editor.view.dom.setAttribute('contenteditable', 'false')

          popupRef.current = tippy(document.body, {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: container,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            onShow: () => {
              console.log('Popup shown')
              if (props.items.length > 0) {
                updateFocus(container, 0, props.items)
              }
            },
            onHide: () => {
              console.log('Popup hidden')
            },
          })

          props.items.forEach((item: MentionItem, index: number) => {
            const button = document.createElement('button')
            button.className = styles.mentionItem
            button.textContent = item.label
            button.setAttribute('type', 'button')
            button.setAttribute('aria-label', `� Select ${item.label}`)
            button.setAttribute('role', 'option')
            button.addEventListener('click', () => {
              console.log('Button clicked:', item)
              props.command({ id: item.id, label: item.label })
              props.editor.commands.focus()
              console.log('Hiding popup on click')
              popupRef.current?.[0]?.hide()
              popupRef.current?.[0]?.destroy()
              setIsSuggestionActive(false)
              if (container.parentNode) {
                container.parentNode.removeChild(container)
              }
            })
            container.appendChild(button)
          })

          if (props.items.length > 0) {
            updateFocus(container, 0, props.items)
          }
        },
        onUpdate: (props) => {
          console.log('Suggestion onUpdate:', props)
          if (!popupRef.current || !popupRef.current[0]) return
          suggestionPropsRef.current = { props, command: props.command }
          editorRef.current = props.editor
          const container = popupRef.current[0].popper.querySelector(`.${styles.mentionSuggestions}`)
          if (!container) return
          container.innerHTML = ''
          focusedIndexRef.current = -1
          suggestionContainerRef.current = container
          props.editor.view.dom.setAttribute('contenteditable', 'false')

          props.items.forEach((item: MentionItem, index: number) => {
            const button = document.createElement('button')
            button.className = styles.mentionItem
            button.textContent = item.label
            button.setAttribute('type', 'button')
            button.setAttribute('aria-label', `Select ${item.label}`)
            button.setAttribute('role', 'option')
            button.addEventListener('click', () => {
              console.log('Button clicked:', item)
              props.command({ id: item.id, label: item.label })
              props.editor.commands.focus()
              console.log('Hiding popup on click')
              popupRef.current?.[0]?.hide()
              popupRef.current?.[0]?.destroy()
              setIsSuggestionActive(false)
              if (container.parentNode) {
                container.parentNode.removeChild(container)
              }
            })
            container.appendChild(button)
          })

          if (props.items.length > 0) {
            updateFocus(container, 0, props.items)
          }
        },
        onKeyDown: (props) => {
          console.log('Suggestion onKeyDown:', props.event.key, 'focusedIndex:', focusedIndexRef.current, 'activeElement:', document.activeElement?.textContent)
          if (!popupRef.current || !popupRef.current[0]) return false
          const container = popupRef.current[0].popper.querySelector(`.${styles.mentionSuggestions}`)
          if (!container) return false

          if (props.event.key === 'Escape') {
            props.event.preventDefault()
            props.event.stopPropagation()
            console.log('Hiding popup on Escape')
            popupRef.current[0].hide()
            popupRef.current[0].destroy()
            focusedIndexRef.current = -1
            setIsSuggestionActive(false)
            props.editor.commands.focus()
            if (container.parentNode) {
              container.parentNode.removeChild(container)
            }
            return true
          }

          if (props.event.key === 'ArrowDown') {
            props.event.preventDefault()
            props.event.stopPropagation()
            const newIndex = focusedIndexRef.current < props.items.length - 1 ? focusedIndexRef.current + 1 : 0
            updateFocus(container, newIndex, props.items)
            return true
          }

          if (props.event.key === 'ArrowUp') {
            props.event.preventDefault()
            props.event.stopPropagation()
            const newIndex = focusedIndexRef.current > 0 ? focusedIndexRef.current - 1 : props.items.length - 1
            updateFocus(container, newIndex, props.items)
            return true
          }

          if (props.event.key === 'Enter') {
            console.log('Enter pressed, focusedIndex:', focusedIndexRef.current, 'items:', props.items)
            props.event.preventDefault()
            props.event.stopPropagation()
            if (focusedIndexRef.current >= 0 && focusedIndexRef.current < props.items.length) {
              const item = props.items[focusedIndexRef.current]
              console.log('Selecting item:', item)
              props.command({ id: item.id, label: item.label })
              props.editor.commands.focus()
              console.log('Hiding popup on Enter')
              popupRef.current[0].hide()
              popupRef.current[0].destroy()
              setIsSuggestionActive(false)
              if (container.parentNode) {
                container.parentNode.removeChild(container)
              }
            }
            return true
          }

          return false
        },
        onExit: (props) => {
          console.log('Suggestion onExit')
          if (popupRef.current && popupRef.current[0]) {
            console.log('Destroying popup in onExit')
            popupRef.current[0].hide()
            popupRef.current[0].destroy()
            if (suggestionContainerRef.current && suggestionContainerRef.current.parentNode) {
              suggestionContainerRef.current.parentNode.removeChild(suggestionContainerRef.current)
            }
          }
          focusedIndexRef.current = -1
          setIsSuggestionActive(false)
          suggestionContainerRef.current = null
          suggestionPropsRef.current = null
          if (editorRef.current) {
            editorRef.current.view.dom.setAttribute('contenteditable', 'true')
            editorRef.current.commands.focus()
          }
        },
      }
    },
  }

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: true,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: true,
      },
    }),
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion,
    }),
  ]

  const onChangeContent = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setContent(value)
  }

  const saveOnBlur = ({ editor, event, transaction }: { editor: TiptapEditor; event: any; transaction: Transaction }) => {
    console.log('Editor onBlur event:', event)
    onChange({
      target: {
        name,
        value: editor.getHTML(),
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={styles.editorContainer}>
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={value}
        onBlur={saveOnBlur}
        onUpdate={({ editor }) => {
          console.log('Editor updated, HTML:', editor.getHTML())
          console.log('Editor state:', editor.getJSON())
          const syntheticEvent = {
            target: {
              name,
              value: editor.getHTML(),
            },
          } as React.ChangeEvent<HTMLInputElement>
          onChangeContent(syntheticEvent)
        }}
        editorProps={{
          handleKeyDown: (view, event) => {
            console.log('Editor handleKeyDown:', event.key, 'isSuggestionActive:', isSuggestionActive, 'activeElement:', document.activeElement?.className)
            if (isSuggestionActive) {
              event.preventDefault()
              event.stopPropagation()
              if (suggestionContainerRef.current) {
                const buttons = suggestionContainerRef.current.querySelectorAll(`button.${styles.mentionItem}`)
                if (buttons.length > 0 && focusedIndexRef.current >= 0) {
                  buttons[focusedIndexRef.current].focus()
                  console.log('Editor redirected focus to button:', buttons[focusedIndexRef.current]?.textContent)
                }
              }
              return true
            }
            return false
          },
        }}
      />
    </div>
  )
}

export default dynamic(() => Promise.resolve(Editor), { ssr: false })
