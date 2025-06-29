import { Box } from '@mui/material'
import DOMPurify from 'dompurify'
import { StyledRichText } from "@/components/StyledFields"
import tippy from 'tippy.js'
// import 'tippy.js/dist/tippy.css'
import ReactDOM from 'react-dom/client'
import PopUp from "@/components/editor/PopUp"
import { useClient } from "@/contexts"

interface RichTextRendererProps {
  html: string | undefined | null;
}

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  const { user, client } = useClient();

  // Define the global handleMouseOver function
  window.handleMouseOver = (mentionId, mentionClass, event) => {
    console.log(`Mouse over mention with ID: ${mentionId}, class: ${mentionClass}`);

    // Destroy all existing Tippy instances across the document
    const allTippies = document.querySelectorAll('[data-tippy-root]');
    allTippies.forEach((tippyEl) => {
      const instance = (tippyEl as HTMLElement)._tippy;
      if (instance) {
        instance.destroy();
      }
    })

    // Create a container div for the React component
    const container = document.createElement('div');

    // Render the PopUp component into the container
    const root = ReactDOM.createRoot(container);
    root.render(<PopUp user={user} client={client} mentionId={mentionId} mentionClass={mentionClass} />);

    // Create a new Tippy instance for the hovered link
    tippy(event.target, {
      content: container,
      showOnCreate: true,
      interactive: true,
      trigger: 'manual',
      placement: 'bottom-start',
      appendTo: () => document.body,
      onHide(instance) {
        // Cleanup: Unmount the React component when the tooltip is hidden
        root.unmount();
        container.remove();
        return true;
      },
    });
  };

  const addMouseOverToMentions = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[data-mention-id]');

    links.forEach((link) => {
      const mentionId = link.getAttribute('data-mention-id');
      const mentionClass = link.getAttribute('data-mention-class-name') || '';
      link.setAttribute('onmouseover', `window.handleMouseOver('${mentionId}', '${mentionClass}', event)`);
    });

    return doc.body.innerHTML;
  };

  const sanitizedHtml = DOMPurify.sanitize(html || '', {
    ADD_ATTR: ['onmouseover', 'target', 'rel', 'data-mention-id', 'data-mention-class-name'],
  });

  return <StyledRichText dangerouslySetInnerHTML={{ __html: addMouseOverToMentions(sanitizedHtml) }} />;
}
