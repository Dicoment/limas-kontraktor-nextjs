"use client"

import { useEffect, useRef } from "react"

interface AutoResizeTextareaProps {
  id?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  rows?: number
}

export default function AutoResizeTextarea({
  id,
  value,
  onChange,
  placeholder,
  className,
  rows = 1
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      id={id}
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`${className} overflow-hidden resize-none`}
    />
  )
}