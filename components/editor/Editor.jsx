import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'
import { useClient } from "@/contexts"

import suggestion from './suggestion.js'

export default ({ name, value, onChange }) => {
  const { user, client } = useClient()

  if (!user?.id) return <></>

  const editor = useEditor({
    extensions: [
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
    ],
    content: value
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}
