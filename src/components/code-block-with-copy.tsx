'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockWithCopyProps {
  children: string
  className?: string
}

/**
 * Enhanced code block component that properly handles formatted content
 * including paragraphs, lists, and other markdown elements
 */
export function CodeBlockWithCopy({ children, className }: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') || 'text'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Process the content to render markdown formatting
  const processContent = (content: string): string => {
    // Remove any leading/trailing whitespace
    let processed = content.trim()
    
    // Convert markdown lists to proper HTML
    processed = processed.replace(/^- (.+)$/gm, '• $1')
    processed = processed.replace(/^\d+\. (.+)$/gm, (match, item) => {
      const numberMatch = match.match(/^\d+/)
      const number = numberMatch ? numberMatch[0] : '1'
      return `${number}. ${item}`
    })
    
    // Convert bold text
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Convert italic text
    processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Convert line breaks to proper spacing
    processed = processed.replace(/\n\n/g, '\n\n')
    processed = processed.replace(/\n/g, '\n')
    
    return processed
  }

  // Check if this should be rendered as formatted content
  const shouldRenderAsFormatted = language === 'text' || language === 'markdown' || language === 'md'

  if (shouldRenderAsFormatted) {
    return (
      <div className="relative group my-6">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border border-border"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div 
          className="bg-muted border border-border rounded-xl p-4 font-mono text-sm leading-6 overflow-x-auto"
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          dangerouslySetInnerHTML={{ 
            __html: processContent(children)
              .split('\n')
              .map(line => {
                // Handle bullet points
                if (line.startsWith('• ')) {
                  return `<div class="ml-4">${line}</div>`
                }
                // Handle numbered lists
                if (/^\d+\. /.test(line)) {
                  return `<div class="ml-4">${line}</div>`
                }
                // Handle empty lines
                if (line.trim() === '') {
                  return '<br>'
                }
                // Handle regular lines
                return `<div>${line}</div>`
              })
              .join('')
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative group my-6">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border border-border"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          padding: '1rem',
          background: 'hsl(var(--muted))',
          border: '1px solid hsl(var(--border))',
          whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
          wordBreak: 'break-word', // Handle long words
          overflowWrap: 'break-word', // Modern browsers
        }}
        codeTagProps={{
          style: {
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
            wordBreak: 'break-word', // Handle long words
            overflowWrap: 'break-word', // Modern browsers
          }
        }}
        wrapLines={true} // Enable line wrapping
        wrapLongLines={true} // Wrap long lines
        showLineNumbers={false} // Disable line numbers for better formatting
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
} 