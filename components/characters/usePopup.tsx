import { useRef, useEffect } from 'react';
import tippy, { Instance } from 'tippy.js';
import ReactDOM from 'react-dom/client';
import PopUp from '@/components/editor/PopUp';
import type { User } from '@/types/types';
import Client from '@/utils/Client';

interface PopupProps {
  containerRef: React.RefObject<HTMLElement>;
  html: string | undefined | null;
  user: User | null;
  client: Client;
}

export function usePopup({ containerRef, html, user, client }: PopupProps) {
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
  }, [html, user, client]);

  return { closeAllTippyInstances };
}
