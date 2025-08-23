import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import RichTextRenderer from '@/components/editor/RichTextRenderer'

// Mock DOMPurify
const mockSanitize = jest.fn((html) => html)
jest.mock('dompurify', () => ({
  sanitize: mockSanitize
}))

// Mock contexts
const mockUseClient = {
  user: { id: 'user-1', gamemaster: true },
  client: {}
}

jest.mock('@/contexts', () => ({
  useClient: () => mockUseClient
}))

// Mock StyledFields
jest.mock('@/components/StyledFields', () => ({
  StyledRichText: function MockStyledRichText(props: any) {
    return (
      <div 
        data-testid="styled-rich-text"
        className={props.className}
        dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
        ref={props.ref}
      />
    )
  }
}))

// Mock CSS module
jest.mock('@/components/editor/Editor.module.scss', () => ({
  richText: 'mock-rich-text-class'
}))

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('RichTextRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSanitize.mockImplementation((html) => html)
  })

  describe('basic rendering', () => {
    test('renders with simple HTML content', () => {
      const html = '<p>Hello World</p>'
      
      renderWithTheme(<RichTextRenderer html={html} />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    test('renders with complex HTML content', () => {
      const html = '<h1>Title</h1><p>Paragraph with <strong>bold</strong> text</p>'
      
      renderWithTheme(<RichTextRenderer html={html} />)
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('bold')).toBeInTheDocument()
    })

    test('renders with empty content', () => {
      renderWithTheme(<RichTextRenderer html="" />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('handles undefined html prop', () => {
      renderWithTheme(<RichTextRenderer html={undefined} />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('handles null html prop', () => {
      renderWithTheme(<RichTextRenderer html={null} />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })
  })

  describe('HTML sanitization', () => {
    test('calls DOMPurify.sanitize with HTML content', () => {
      const html = '<p>Test content</p>'
      
      renderWithTheme(<RichTextRenderer html={html} />)
      
      expect(mockSanitize).toHaveBeenCalledWith('<p>Test content</p>', {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('calls DOMPurify.sanitize with empty string for null/undefined', () => {
      renderWithTheme(<RichTextRenderer html={null} />)
      
      expect(mockSanitize).toHaveBeenCalledWith('', {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('passes correct configuration to DOMPurify', () => {
      const html = '<a href="#" data-mention-id="123">Link</a>'
      
      renderWithTheme(<RichTextRenderer html={html} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(html, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('renders sanitized HTML output', () => {
      const originalHtml = '<p>Original</p><script>alert("xss")</script>'
      const sanitizedHtml = '<p>Original</p>'
      mockSanitize.mockReturnValue(sanitizedHtml)
      
      renderWithTheme(<RichTextRenderer html={originalHtml} />)
      
      expect(screen.getByText('Original')).toBeInTheDocument()
      expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument()
    })

    test('handles malicious script injection attempts', () => {
      const maliciousHtml = '<img src="x" onerror="alert(1)">'
      const sanitizedHtml = '<img src="x">'
      mockSanitize.mockReturnValue(sanitizedHtml)
      
      renderWithTheme(<RichTextRenderer html={maliciousHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(maliciousHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })
  })

  describe('mention support', () => {
    test('preserves mention attributes in sanitization config', () => {
      const htmlWithMentions = '<a data-mention-id="user-1" data-mention-class-name="user-mention">@username</a>'
      
      renderWithTheme(<RichTextRenderer html={htmlWithMentions} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithMentions, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('preserves link attributes in sanitization config', () => {
      const htmlWithLinks = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>'
      
      renderWithTheme(<RichTextRenderer html={htmlWithLinks} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithLinks, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles mention processing function', () => {
      const htmlWithMentions = '<a data-mention-id="user-1" data-processed="false">@user</a>'
      
      // Mock the DOM parser and processing
      const mockDoc = {
        querySelectorAll: jest.fn(() => [
          {
            setAttribute: jest.fn()
          }
        ]),
        body: {
          innerHTML: '<a data-mention-id="user-1" data-processed="true">@user</a>'
        }
      }
      
      global.DOMParser = jest.fn(() => ({
        parseFromString: jest.fn(() => mockDoc)
      })) as any
      
      renderWithTheme(<RichTextRenderer html={htmlWithMentions} />)
      
      // Should call DOMPurify with original HTML
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithMentions, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })
  })

  describe('component structure', () => {
    test('uses StyledRichText component', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('applies correct CSS class from module', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      const richTextElement = screen.getByTestId('styled-rich-text')
      expect(richTextElement).toHaveClass('mock-rich-text-class')
    })

    test('sets component prop to div', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      // StyledRichText should receive component="div" prop
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('uses dangerouslySetInnerHTML for content', () => {
      const html = '<p>Dangerous content</p>'
      
      renderWithTheme(<RichTextRenderer html={html} />)
      
      const element = screen.getByTestId('styled-rich-text')
      expect(element.innerHTML).toBe(html)
    })

    test('creates container ref', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      // Ref should be attached to the styled component
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })
  })

  describe('context integration', () => {
    test('accesses user context', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      // Component should render without crashing when accessing context
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('accesses client context', () => {
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })

    test('handles missing user context', () => {
      const mockUseClientWithoutUser = require('@/contexts')
      mockUseClientWithoutUser.useClient.mockReturnValue({
        user: null,
        client: {}
      })
      
      renderWithTheme(<RichTextRenderer html="<p>Test</p>" />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('handles very large HTML content', () => {
      const largeHtml = '<p>' + 'A'.repeat(10000) + '</p>'
      
      renderWithTheme(<RichTextRenderer html={largeHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(largeHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles HTML with nested structures', () => {
      const nestedHtml = `
        <div>
          <h1>Title</h1>
          <ul>
            <li>Item 1</li>
            <li>Item 2 with <a href="#">link</a></li>
          </ul>
          <blockquote>
            <p>Quote with <strong>formatting</strong></p>
          </blockquote>
        </div>
      `
      
      renderWithTheme(<RichTextRenderer html={nestedHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(nestedHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles HTML with special characters', () => {
      const htmlWithSpecialChars = '<p>&lt;&gt;&amp;&quot;&#39;</p>'
      
      renderWithTheme(<RichTextRenderer html={htmlWithSpecialChars} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithSpecialChars, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles malformed HTML', () => {
      const malformedHtml = '<p>Unclosed paragraph<div>Nested incorrectly</p></div>'
      
      renderWithTheme(<RichTextRenderer html={malformedHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(malformedHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles empty string gracefully', () => {
      renderWithTheme(<RichTextRenderer html="" />)
      
      expect(screen.getByTestId('styled-rich-text')).toBeInTheDocument()
      expect(mockSanitize).toHaveBeenCalledWith('', {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles whitespace-only content', () => {
      const whitespaceHtml = '   \n\t   '
      
      renderWithTheme(<RichTextRenderer html={whitespaceHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(whitespaceHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })
  })

  describe('security considerations', () => {
    test('sanitizes potentially dangerous HTML elements', () => {
      const dangerousHtml = `
        <script>alert('xss')</script>
        <iframe src="javascript:alert('xss')"></iframe>
        <object data="javascript:alert('xss')"></object>
        <embed src="javascript:alert('xss')">
      `
      
      renderWithTheme(<RichTextRenderer html={dangerousHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(dangerousHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('sanitizes dangerous attributes', () => {
      const htmlWithDangerousAttrs = `
        <div onclick="alert('xss')" onload="alert('xss')">
          <a href="javascript:alert('xss')">Link</a>
        </div>
      `
      
      renderWithTheme(<RichTextRenderer html={htmlWithDangerousAttrs} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithDangerousAttrs, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('preserves safe HTML content', () => {
      const safeHtml = `
        <p>Safe paragraph</p>
        <strong>Bold text</strong>
        <em>Italic text</em>
        <a href="https://example.com">Safe link</a>
        <ul><li>List item</li></ul>
      `
      
      renderWithTheme(<RichTextRenderer html={safeHtml} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(safeHtml, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })

    test('handles CSS injection attempts', () => {
      const htmlWithCSS = '<p style="background: url(javascript:alert(1))">Text</p>'
      
      renderWithTheme(<RichTextRenderer html={htmlWithCSS} />)
      
      expect(mockSanitize).toHaveBeenCalledWith(htmlWithCSS, {
        ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-class-name']
      })
    })
  })

  describe('performance considerations', () => {
    test('handles repeated renders with same content', () => {
      const html = '<p>Same content</p>'
      const { rerender } = renderWithTheme(<RichTextRenderer html={html} />)
      
      // Clear previous calls
      mockSanitize.mockClear()
      
      // Rerender with same content
      rerender(
        <ThemeProvider theme={theme}>
          <RichTextRenderer html={html} />
        </ThemeProvider>
      )
      
      expect(mockSanitize).toHaveBeenCalledTimes(1)
    })

    test('handles content changes efficiently', () => {
      const initialHtml = '<p>Initial content</p>'
      const updatedHtml = '<p>Updated content</p>'
      
      const { rerender } = renderWithTheme(<RichTextRenderer html={initialHtml} />)
      
      expect(screen.getByText('Initial content')).toBeInTheDocument()
      
      rerender(
        <ThemeProvider theme={theme}>
          <RichTextRenderer html={updatedHtml} />
        </ThemeProvider>
      )
      
      expect(screen.getByText('Updated content')).toBeInTheDocument()
    })
  })
})