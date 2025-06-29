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

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
    content: value
  })

  if (!editor) {
    return null
  }

  return <EditorContent editor={editor} />
}
