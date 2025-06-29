import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
import { StyledRichText } from "@/components/StyledFields";

interface RichTextRendererProps {
  html: string | undefined | null;
}

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  // Define the global handleMouseOver function
  window.handleMouseOver = (mentionId, mentionClass) => {
    console.log(`Mouse over mention with ID: ${mentionId}, class: ${mentionClass}`);
    // Add more functionality here, like showing a tooltip or fetching data
  };

  const addMouseOverToMentions = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[data-mention-id]');

    links.forEach((link) => {
      const mentionId = link.getAttribute('data-mention-id');
      const mentionClass = link.getAttribute('data-mention-class-name') || '';
      link.setAttribute('onmouseover', `window.handleMouseOver('${mentionId}', '${mentionClass}')`);
    });

    // Serialize back to string, preserving original structure
    return doc.body.innerHTML;
  };

  const sanitizedHtml = DOMPurify.sanitize(html || '', {
    ADD_ATTR: ['onmouseover', 'target', 'rel', 'data-mention-id', 'data-mention-class-name'],
  });

  return <StyledRichText dangerouslySetInnerHTML={{ __html: addMouseOverToMentions(sanitizedHtml) }} />;
}
