// utils/RichTextRenderer.tsx
import { Box, styled } from '@mui/material';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  html: string | undefined | null
}

const StyledRichText = styled(Box)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif', // Fixed: Single string with fallback
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
  // color: 'var(--black)',
  // background: 'var(--blue-grey-200)',
  // padding: '8px',
  borderRadius: '4px',
  '& p': {
    margin: '0 0 1rem',
  },
  '& ul, & ol': {
    paddingLeft: '1.5rem',
    margin: '1rem 0',
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: '1.5rem 0 1rem',
    fontWeight: theme.typography.fontWeightBold,
    color: 'var(--black)',
  },
  '& h1': { fontSize: '1.4rem' },
  '& h2': { fontSize: '1.2rem' },
  '& h3': { fontSize: '1.1rem' },
  '& blockquote': {
    borderLeft: `3px solid var(--grey-800)`,
    paddingLeft: '1rem',
    margin: '1.5rem 0',
    color: 'var(--black)',
  },
  '& code': {
    backgroundColor: 'var(--purple-light)',
    borderRadius: '4px',
    padding: '0.2em 0.4em',
    fontSize: '0.85rem',
    fontFamily: 'Roboto, sans-serif', // Fixed: Single string
  },
  '& pre': {
    backgroundColor: 'var(--black)',
    color: 'var(--white)',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    fontFamily: 'Roboto, sans-serif', // Fixed: Single string
    margin: '1.5rem 0',
  },
  '& hr': {
    border: 'none',
    borderTop: `1px solid var(--gray-2)`,
    margin: '2rem 0',
  },
}));

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  const sanitizedHtml = DOMPurify.sanitize(html || "");
  return <StyledRichText dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
