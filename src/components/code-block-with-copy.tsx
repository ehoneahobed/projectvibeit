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
        }}
        codeTagProps={{
          style: {
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
          }
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
} 