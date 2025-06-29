import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import { StyledRichText } from '@/components/StyledFields';
import tippy, { Instance } from 'tippy.js';
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
  const tippyInstancesRef = useRef<Instance[]>([]);

  const closeAllTippyInstances = () => {
    tippyInstancesRef.current.forEach((instance) => instance.destroy());
    tippyInstancesRef.current = [];
  };

  const handleMouseOver = (mentionId: string, mentionClass: string, event: MouseEvent) => {
    const target = event.target as HTMLElement;

    closeAllTippyInstances();

    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);
    root.render(<PopUp user={user} client={client} mentionId={mentionId} mentionClass={mentionClass} />);

    const tippyInstance = tippy(target as Element, {
      content: container,
      showOnCreate: true,
      interactive: true,
      trigger: 'manual',
      placement: 'bottom-start',
      appendTo: () => document.body,
      onHide() {
        root.unmount();
        container.remove();
      },
    });

    tippyInstancesRef.current.push(tippyInstance);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseLeave = () => {
      closeAllTippyInstances();
    };
    container.addEventListener('mouseleave', handleMouseLeave);

    const links = container.querySelectorAll('a[data-mention-id]');
    const handlers: Array<{ link: HTMLElement; handler: (event: MouseEvent) => void }> = [];

    links.forEach((link) => {
      const mentionId = link.getAttribute('data-mention-id') || '';
      const mentionClass = link.getAttribute('data-mention-class-name') || '';
      const handler = (event: MouseEvent) => handleMouseOver(mentionId, mentionClass, event);
      (link as HTMLElement).addEventListener('mouseover', handler);
      handlers.push({ link: link as HTMLElement, handler });
    });

    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
      handlers.forEach(({ link, handler }) => link.removeEventListener('mouseover', handler));
      closeAllTippyInstances();
    };
  }, [html]);

  const addMouseOverAttributes = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[data-mention-id]');

    links.forEach((link) => {
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
