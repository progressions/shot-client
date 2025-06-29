import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from './MentionList.jsx'

export default (user, client) => ({
  items: ({ query }) => {
    return [
      { id: "1", label: 'Lea Thompson', class: "Character" },
      { id: "2", label: 'Cyndi Lauper', class: "Character" },
      { id: "3", label:  'Tom Cruise', class: "Character" },
      { id: "3", label:  'Madonna', class: "Character" },
      { id: "3", label:  'Jerry Hall', class: "Character" },
      { id: "3", label:  'Joan Collins', class: "Character" },
      { id: "3", label:  'Winona Ryder', class: "Character" },
      { id: "3", label:  'Christina Applegate', class: "Character" },
      { id: "3", label:  'Alyssa Milano', class: "Character" },
      { id: "3", label:  'Molly Ringwald', class: "Character" },
      { id: "3", label:  'Ally Sheedy', class: "Character" },
      { id: "3", label:  'Debbie Harry', class: "Character" },
      { id: "3", label:  'Olivia Newton-John', class: "Character" },
      { id: "3", label:  'Elton John', class: "Character" },
      { id: "3", label:  'Michael J. Fox', class: "Character" },
      { id: "3", label:  'Axl Rose', class: "Character" },
      { id: "3", label:  'Emilio Estevez', class: "Character" },
      { id: "3", label:  'Ralph Macchio', class: "Character" },
      { id: "3", label:  'Rob Lowe', class: "Character" },
      { id: "3", label:  'Jennifer Grey', class: "Character" },
      { id: "3", label:  'Mickey Rourke', class: "Character" },
      { id: "3", label:  'John Cusack', class: "Character" },
      { id: "3", label:  'Matthew Broderick', class: "Character" },
      { id: "3", label:  'Justine Bateman', class: "Character" },
      { id: "3", label:  'Lisa Bonet', class: "Character" },
    ]
      .filter(item => item.label.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5)
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        console.log("suggestion props", props)

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        console.log("suggestion keydown props", props)
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
})
