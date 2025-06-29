import { Box, styled } from '@mui/material';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  html: string | undefined | null;
}

const StyledRichText = styled(Box)(({ theme }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
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
    fontFamily: 'Roboto, sans-serif',
  },
  '& pre': {
    backgroundColor: 'var(--black)',
    color: 'var(--white)',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    fontFamily: 'Roboto, sans-serif',
    margin: '1.5rem 0',
  },
  '& hr': {
    border: 'none',
    borderTop: `1px solid var(--gray-2)`,
    margin: '2rem 0',
  },
  '& a': {
    color: '#1d4ed8',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: '#1e40af', // Darker blue on hover
    },
    '&.mention': {
      fontWeight: theme.typography.fontWeightBold,
      color: "white",
      padding: '0.1em 0.2em',
      '&:hover': {
        borderRadius: '4px',
        backgroundColor: '#1e40af', // Darker blue background on hover
        color: "white",
      },
    },
  },
}));

export default function RichTextRenderer({ html }: RichTextRendererProps) {
  const sanitizedHtml = DOMPurify.sanitize(html || '', {
    ADD_ATTR: ['target', 'rel', 'data-mention-id'], // Allow mention link attributes
  });
  return <StyledRichText dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
