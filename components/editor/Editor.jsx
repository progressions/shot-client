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
import styles from "@/components/editor/Editor.module.scss"
import { useState, useRef, useEffect } from "react"
import { Transaction, Plugin, PluginKey } from "@tiptap/pm/state"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import { useClient } from "@/contexts"

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

const fetchSuggestions = async (query, client) => {
  try {
    const data = await client.getSuggestions({ query })
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
}

const preprocessContent = (html) => {
  let processed = html.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>')
  processed = processed.replace(
    /<a href="([^"]+)" class="mention"[^>]*data-mention-id="([^"]+)"[^>]*>(@[^<]+)<\/a>/g,
    (match, href, id, label) => {
      const cleanLabel = label.replace(/^@/, '')
      return `<span data-type="mention" data-id="${id}" data-label="${cleanLabel}" data-href="${href}">@${cleanLabel}</span>`
    }
  )
  console.log('Preprocessed HTML:', processed)
  return processed
}

const DebugParsePlugin = new Plugin({
  key: new PluginKey('debugParse'),
  props: {
    handleDOMEvents: {
      paste(view, event) {
        console.log('Paste event:', event.clipboardData?.getData('text/html'))
        return false
      },
    },
    transformPastedHTML(html) {
      console.log('Transforming pasted HTML:', html)
      const transformed = html.replace(
        /<a href="([^"]+)" class="mention"[^>]*data-mention-id="([^"]+)"[^>]*>(@[^<]+)<\/a>/g,
        (match, href, id, label) => {
          const cleanLabel = label.replace(/^@/, '')
          return `<span data-type="mention" data-id="${id}" data-label="${cleanLabel}" data-href="${href}">@${cleanLabel}</span>`
        }
      )
      console.log('Transformed pasted HTML:', transformed)
      return transformed
    },
  },
})

const Editor = ({ value, onChange, name = 'description' }) => {
  const { user, client } = useClient()
  const [content, setContent] = useState(value)
  const [isSuggestionActive, setIsSuggestionActive] = useState(false)
  const suggestionContainerRef = useRef(null)
  const suggestionPropsRef = useRef(null)
  const focusedIndexRef = useRef(-1)
  const editorRef = useRef(null)
  const popupRef = useRef(null)
  const isCleaningUp = useRef(false)

  console.log({ user, client })

  const processedValue = preprocessContent(value)

  const updateFocus = (container, newIndex, items) => {
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

  const cleanupTippy = () => {
    if (isCleaningUp.current) {
      console.log('Skipping cleanup, already in progress')
      return
    }
    isCleaningUp.current = true
    console.log('Cleaning up Tippy elements, popupRef.current:', popupRef.current, 'isVisible:', popupRef.current?.[0]?.state?.isVisible)
    if (popupRef.current && popupRef.current[0]) {
      popupRef.current[0].hide()
      const popper = popupRef.current[0].popper
      if (popper) {
        popper.innerHTML = ''
        if (popper.parentNode) {
          popper.parentNode.removeChild(popper)
        }
      }
      setTimeout(() => {
        if (popupRef.current && popupRef.current[0]) {
          popupRef.current[0].destroy()
          popupRef.current = null
        }
      }, 50)
      document.querySelectorAll('[data-tippy-root], .tippy-box').forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })
    }
    setIsSuggestionActive(false)
    suggestionContainerRef.current = null
    suggestionPropsRef.current = null
    focusedIndexRef.current = -1
    isCleaningUp.current = false
    console.log('Popper in DOM after cleanup:', document.querySelector('div[id^="tippy-"]'))
  }

  useEffect(() => {
    console.log('Editor mounted with value:', value)
    return () => {
      console.log('Editor unmounting, editorRef.current:', editorRef.current, 'value:', value)
      cleanupTippy()
    }
  }, [value])

  useEffect(() => {
    if (isSuggestionActive && suggestionContainerRef.current) {
      const buttons = suggestionContainerRef.current.querySelectorAll(`button.${styles.mentionItem}`)
      if (buttons.length > 0 && focusedIndexRef.current >= 0) {
        buttons[focusedIndexRef.current].focus()
        console.log('useEffect: Focused button:', buttons[focusedIndexRef.current].textContent, 'activeElement:', document.activeElement?.textContent)
      }
    }
  }, [isSuggestionActive])

  useEffect(() => {
    const container = suggestionContainerRef.current
    if (!container || !isSuggestionActive) return

    const handleKeyDown = (e) => {
      console.log('Container keydown:', e.key, 'focusedIndex:', focusedIndexRef.current, 'activeElement:', document.activeElement?.textContent)
      if (!suggestionPropsRef.current) return
      const { props, command } = suggestionPropsRef.current
      e.preventDefault()
      e.stopPropagation()

      if (e.key === 'Escape') {
        console.log('Hiding popup on Escape')
        suggestionPropsRef.current?.props.editor.commands.focus()
        cleanupTippy()
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
        cleanupTippy()
        return
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      cleanupTippy()
    }
  }, [isSuggestionActive])

  const suggestion = {
    char: '@',
    pluginKey: new PluginKey('mention'),
    items: async ({ query }) => {
      return await fetchSuggestions(query, client)
    },
    render: () => {
      return {
        onStart: (props) => {
          console.log('Suggestion onStart:', props)
          if (!isSuggestionActive) {
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
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: container,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
              duration: [300, 0],
              onShow: () => {
                console.log('Popup shown')
                if (props.items.length > 0) {
                  updateFocus(container, 0, props.items)
                }
              },
              onHide: () => {
                console.log('Popup hidden')
                cleanupTippy()
              },
            })

            props.items.forEach((item, index) => {
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
                cleanupTippy()
              })
              container.appendChild(button)
            })

            if (props.items.length > 0) {
              updateFocus(container, 0, props.items)
            }
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

          props.items.forEach((item, index) => {
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
              cleanupTippy()
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
            cleanupTippy()
            props.editor.commands.focus()
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
              cleanupTippy()
            }
            return true
          }

          return false
        },
        onExit: (props) => {
          console.log('Suggestion onExit')
          cleanupTippy()
          if (editorRef.current) {
            editorRef.current.view.dom.setAttribute('contenteditable', 'true')
            editorRef.current.commands.focus()
          }
        },
      }
    },
  }

  const extensions = [
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion,
      renderHTML({ node }) {
        const { id, label } = node.attrs
        if (!id || !label) {
          console.warn('renderHTML: Missing id or label:', node)
          return ['span', { class: 'mention' }, `@${label || 'unknown'}`]
        }
        const url = `/characters/${id}`
        return [
          'a',
          {
            href: url,
            class: 'mention',
            target: '_blank',
            rel: 'noopener noreferrer',
            'data-mention-id': id,
          },
          `@${label}`,
        ]
      },
      parseHTML() {
        return [
          {
            tag: 'span[data-type="mention"]',
            priority: 1000,
            getAttrs: (element) => {
              if (typeof element === 'string') {
                console.warn('parseHTML: Received string:', element)
                return null
              }
              console.log('parseHTML: Attempting to parse:', element.outerHTML)
              const id = element.getAttribute('data-id')
              const href = element.getAttribute('data-href')
              const label = element.getAttribute('data-label') || element.textContent?.replace(/^@/, '') || ''
              console.log('parseHTML: Processing mention:', {
                id,
                label,
                href,
                textContent: element.textContent,
                outerHTML: element.outerHTML,
              })
              if (!id || !label) {
                console.warn('parseHTML: Invalid attributes:', { id, label, href })
                return null
              }
              return {
                id,
                label: label.replace(/^@/, ''),
                href: href || `/characters/${id}`,
              }
            },
          },
        ]
      },
      addAttributes() {
        return {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-id'),
            renderHTML: (attributes) => ({
              'data-mention-id': attributes.id,
            }),
          },
          label: {
            default: null,
            parseHTML: (element) => {
              const label = element.getAttribute('data-label') || element.textContent?.replace(/^@/, '') || ''
              return label.replace(/^@/, '')
            },
            renderHTML: () => null,
          },
          href: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-href'),
            renderHTML: (attributes) => ({
              href: attributes.href || `/characters/${attributes.id}`,
            }),
          },
        }
      },
      addNodeView() {
        return () => ({
          dom: document.createElement('a'),
          update: (node) => {
            if (node.type.name !== 'mention') return false
            const { id, label } = node.attrs
            if (!id || !label) return false
            this.dom.setAttribute('href', `/characters/${id}`)
            this.dom.setAttribute('class', 'mention')
            this.dom.setAttribute('target', '_blank')
            this.dom.setAttribute('rel', 'noopener noreferrer')
            this.dom.setAttribute('data-mention-id', id)
            this.dom.textContent = `@${label}`
            return true
          },
        })
      },
    }),
    DebugParsePlugin,
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
      link: false,
      paragraph: {
        content: 'inline*',
      },
      listItem: {
        content: '(paragraph | mention)*',
      },
    }),
  ]

  const onChangeContent = (event) => {
    const { value } = event.target
    setContent(value)
  }

  const saveOnBlur = ({ editor, event, transaction }) => {
    console.log('Editor onBlur event:', event)
    onChange({
      target: {
        name,
        value: editor.getHTML(),
      },
    })
  }

  if (!user?.id) return <></>

  return (
    <div className={styles.editorContainer}>
      <EditorProvider
        immediatelyRender={false}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={processedValue}
        onCreate={({ editor }) => {
          editorRef.current = editor
          console.log('Editor created with value:', processedValue)
          console.log('Editor schema (mention node):', editor.schema.nodes.mention || 'Mention node not found')
          console.log('Initial editor JSON:', JSON.stringify(editor.getJSON(), null, 2))
          console.log('Initial editor HTML:', editor.getHTML())
          if (!editor.schema.nodes.mention) {
            console.error('Error: Mention node is missing from schema')
          }
        }}
        onBlur={saveOnBlur}
        onUpdate={({ editor }) => {
          const html = editor.getHTML()
          console.log('Editor updated, HTML:', html)
          const syntheticEvent = {
            target: {
              name,
              value: html,
            },
          }
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
