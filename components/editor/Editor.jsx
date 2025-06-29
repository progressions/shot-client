import dynamic from "next/dynamic"
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StarterKit from "@tiptap/starter-kit"
import { Editor as TiptapEditor, EditorProvider, useCurrentEditor } from "@tiptap/react"
import { useState } from "react"
import { useClient } from "@/contexts"
import { preprocessContent } from "@/components/editor/utils"
import MenuBar from "@/components/editor/MenuBar"
import styles from "@/components/editor/Editor.module.scss"

import suggestion from './suggestion.js'

const Editor = ({ name, value, onChange }) => {
  const { user, client } = useClient()
  const [content, setContent] = useState(value || '')

  if (!user?.id) return <></>

  const extensions = [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: suggestion(user, client),
        renderHTML({ node }) {
          console.log('renderHTML', node)
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

  const processedValue = preprocessContent(value)

  return (
    <div className={styles.editorContainer}>
      <EditorProvider
        sx={{ width: '100%' }}
        immediatelyRender={false}
        extensions={extensions}
        slotBefore={<MenuBar />}
        content={processedValue || ""}
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
        />
      </div>
      )
}

export default dynamic(() => Promise.resolve(Editor), { ssr: false })
