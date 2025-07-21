import dynamic from "next/dynamic"
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import StarterKit from "@tiptap/starter-kit"
import { Editor as TiptapEditor, EditorProvider, useCurrentEditor } from "@tiptap/react"
import { useState } from "react"
import { useClient } from "@/contexts"
import MenuBar from "@/components/editor/MenuBar"
import styles from "@/components/editor/Editor.module.scss"

import suggestion from './suggestion.js'

const Editor = ({ name, value, onChange }) => {
  const { user, client } = useClient()
  const [content, setContent] = useState(value || '')

  if (!user?.id) return <></>

  const preprocessContent = (html) => {
    let processed = html.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>');
    const regex = new RegExp(`<a href="([^"]+)" class="${styles.mention}"[^>]*data-mention-id="([^"]+)"[^>]*data-mention-class-name="([^"]*)"[^>]*>(@[^<]+)</a>`, "g")
    processed = processed.replace(
      regex,
      (match, href, id, className, label) => {
        const cleanLabel = label.replace(/^@/, '');
        return `<span data-type="mention" data-id="${id}" data-label="${cleanLabel}" data-href="${href}" data-mention-class-name="${className}">@${cleanLabel}</span>`;
      }
    );
    return processed;
  };

  const CustomMention = Mention.extend({
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: element => element.getAttribute('data-id'),
          renderHTML: attributes => ({
            'data-id': attributes.id || null,
          }),
        },
        label: {
          default: null,
          parseHTML: element => element.getAttribute('data-label'),
          renderHTML: attributes => ({
            'data-label': attributes.label || null,
          }),
        },
        className: {
          default: null,
          parseHTML: element => element.getAttribute('data-mention-class-name'),
          renderHTML: attributes => ({
            'data-mention-class-name': attributes.className || null,
          }),
        },
        mentionSuggestionChar: {
          default: '@',
          parseHTML: element => element.getAttribute('data-mention-suggestion-char'),
          renderHTML: attributes => ({
            'data-mention-suggestion-char': attributes.mentionSuggestionChar || '@',
          }),
        },
      };
    },
  });

  function getUrl(className, id) {
    const urlMap = {
      Character: `/characters/${id}`,
      Vehicle: `/vehicles/${id}`,
      Site: `/sites/${id}`,
      Party: `/parties/${id}`,
      Faction: `/factions/${id}`,
      Schtick: `/schticks/${id}`,
      Weapon: `/weapons/${id}`,
      Juncture: `/junctures/${id}`,
      Type: `/`,
      Archetype: `/`,
    }
    return urlMap[className] || ""
  }

  const extensions = [
    StarterKit.configure({
      mention: false,
    }),
    CustomMention.configure({
      HTMLAttributes: { class: styles.mention },
      suggestion: suggestion(user, client),
      renderHTML({ node }) {
        const { id, label, className } = node.attrs;
        if (!id || !label) {
          return ['span', { class: styles.mention }, `@${label || 'unknown'}`];
        }
        const url = getUrl(className, id);
        return [
          'a',
          {
            href: url,
            class: styles.mention,
            target: '_blank',
            rel: 'noopener noreferrer',
            'data-mention-id': id,
            'data-mention-class-name': className || '',
          },
          `@${label}`,
        ];
      },
    }),
  ];

  const onChangeContent = (event) => {
    const { value } = event.target
    setContent(value)
  }

  const saveOnBlur = ({ editor, event, transaction }) => {
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
