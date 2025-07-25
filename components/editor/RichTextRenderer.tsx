import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import { StyledRichText } from '@/components/StyledFields';
import { useClient } from '@/contexts';
import { useRef } from 'react';
import styles from "@/components/editor/Editor.module.scss";

interface RichTextRendererProps {
  html: string | undefined | null;
}

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  const { user, client } = useClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const sanitizedHtml = DOMPurify.sanitize(html || '', {
    ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name'],
  });

  const addMouseOverAttributes = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[data-mention-id]');

    links.forEach((link) => {
      link.setAttribute('data-processed', 'true');
    });

    return doc.body.innerHTML;
  };

  return (
    <StyledRichText
      component="div"
      className={styles.richText}
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
