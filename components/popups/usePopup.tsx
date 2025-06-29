import { useRef, useEffect } from 'react';
import tippy, { Instance } from 'tippy.js';
import ReactDOM from 'react-dom/client';
import PopUp from '@/components/popups/PopUp';
import type { User } from '@/types/types';
import Client from '@/utils/Client';

interface PopupProps {
  containerRef: React.RefObject<HTMLElement>;
  user: User | null;
  client: Client;
}

interface TriggerPopupParams {
  mentionId: string;
  mentionClass: string;
  target: HTMLElement;
}

export function usePopup({ containerRef, user, client }: PopupProps) {
  const tippyInstancesRef = useRef<Instance[]>([]);

  const closeAllTippyInstances = () => {
    tippyInstancesRef.current.forEach((instance) => instance.destroy());
    tippyInstancesRef.current = [];
  };

  const triggerPopup = ({ mentionId, mentionClass, target }: TriggerPopupParams) => {
    closeAllTippyInstances();

    const container = document.createElement('div');
    const root = ReactDOM.createRoot(container);
    root.render(<PopUp user={user} client={client} mentionId={mentionId} mentionClass={mentionClass} />);

    const tippyInstance = tippy(target, {
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
      const handler = (event: MouseEvent) => {
        triggerPopup({ mentionId, mentionClass, target: event.target as HTMLElement });
      };
      (link as HTMLElement).addEventListener('mouseover', handler);
      handlers.push({ link: link as HTMLElement, handler });
    });

    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
      handlers.forEach(({ link, handler }) => link.removeEventListener('mouseover', handler));
      closeAllTippyInstances();
    };
  }, [user, client]);

  return { triggerPopup, closeAllTippyInstances };
}
