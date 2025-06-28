import dynamic from 'next/dynamic'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { Editor as TiptapEditor, EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import { Button, ButtonGroup } from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import styles from './Editor.module.scss'
import { useState } from 'react'
import { FocusEvent } from 'react'
import { Transaction } from '@tiptap/pm/state'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { PluginKey } from '@tiptap/pm/state'
import { SuggestionOptions } from '@tiptap/suggestion'

interface EditorProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
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

interface MentionItem {
  id: string
  label: string
}

// Mock user data (replace with API call to Rails backend)
const fetchSuggestions = async (query: string): Promise<MentionItem[]> => {
  const users = [
    { id: '1', label: 'Alice Smith' },
    { id: '2', label: 'Bob Johnson' },
    { id: '3', label: 'Charlie Brown' },
  ]
  return users.filter((user) =>
    user.label.toLowerCase().includes(query.toLowerCase())
  )
}

const suggestion: SuggestionOptions['suggestion'] = {
  char: '@',
  pluginKey: new PluginKey('mention'),
  items: async ({ query }) => {
    return await fetchSuggestions(query)
  },
  render: () => {
    let popup: any

    return {
      onStart: (props) => {
        console.log('Suggestion onStart:', props)
        const container = document.createElement('div')
        container.className = styles.mentionSuggestions

        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: container,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })

        // Populate initial items
        props.items.forEach((item: MentionItem) => {
          const button = document.createElement('button')
          button.className = styles.mentionItem
          button.textContent = item.label
          button.addEventListener('click', () => {
            props.command({ id: item.id, label: item.label })
          })
          container.appendChild(button)
        })
      },
      onUpdate: (props) => {
        console.log('Suggestion onUpdate:', props)
        if (!popup || !popup[0]) return
        const container = popup[0].popper.querySelector(`.${styles.mentionSuggestions}`)
        if (!container) return
        container.innerHTML = ''
        props.items.forEach((item: MentionItem) => {
          const button = document.createElement('button')
          button.className = styles.mentionItem
          button.textContent = item.label
          button.addEventListener('click', () => {
            props.command({ id: item.id, label: item.label })
          })
          container.appendChild(button)
        })
      },
      onKeyDown: (props) => {
        if (props.event.key === 'Escape') {
          if (popup && popup[0]) {
            popup[0].hide()
          }
          return true
        }
        return false
      },
      onExit: () => {
        if (popup && popup[0]) {
          popup[0].destroy()
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

const Editor = ({ value, onChange, name = 'description' }: EditorProps) => {
  const [content, setContent] = useState<string>(value)

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
      />
    </div>
  )
}

export default dynamic(() => Promise.resolve(Editor), { ssr: false })
