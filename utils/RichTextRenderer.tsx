import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import { StyledRichText } from '@/components/StyledFields';
import tippy from 'tippy.js';
import ReactDOM from 'react-dom/client';
import PopUp from '@/components/editor/PopUp';
import { useClient } from '@/contexts';
import { useRef, useEffect } from 'react';

interface RichTextRendererProps {
  html: string | undefined | null;
}

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  const { user, client } = useClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseOver = (mentionId: string, mentionClass: string, event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Destroy all existing Tippy instances
    const allTippies = document.querySelectorAll('[data-tippy-root]');
    allTippies.forEach((tippyEl) => {
      const instance = (tippyEl as HTMLElement)._tippy;
      if (instance) {
        instance.destroy();
      }
    });

    // Create a container for the React component
    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);
    root.render(<PopUp user={user} client={client} mentionId={mentionId} mentionClass={mentionClass} />);

    // Create a new Tippy instance
    const tippyInstance = tippy(target, {
      content: container,
      showOnCreate: true,
      interactive: true,
      trigger: 'manual',
      placement: 'bottom-start',
      appendTo: () => document.body,
      onHide(instance) {
        root.unmount();
        container.remove();
        return true;
      },
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const links = container.querySelectorAll('a[data-mention-id]');
    links.forEach((link) => {
      const mentionId = link.getAttribute('data-mention-id') || '';
      const mentionClass = link.getAttribute('data-mention-class-name') || '';
      const handler = (event: MouseEvent) => handleMouseOver(mentionId, mentionClass, event);
      link.addEventListener('mouseover', handler);

      // Cleanup event listener on unmount
      return () => link.removeEventListener('mouseover', handler);
    });
  }, [html]);

  const addMouseOverAttributes = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[data-mention-id]');

    links.forEach((link) => {
      // Attributes are already present; no need to add onmouseover
      link.setAttribute('data-processed', 'true');
    });

    return doc.body.innerHTML;
  };

  const sanitizedHtml = DOMPurify.sanitize(html || '', {
    ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name'],
  });

  return (
    <StyledRichText
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: addMouseOverAttributes(sanitizedHtml) }}
    />
  );
}
