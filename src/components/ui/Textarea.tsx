"use client"

import { TextareaHTMLAttributes } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export default function Textarea({ error, className = "", ...props }: TextareaProps) {
  const errorClass = error ? "border-red-500 focus:ring-red-500" : "border-slate-300"
  return (
    <textarea
      className={`w-full px-3 py-2 rounded ${errorClass} ${className}`}
      {...props}
    />
  )
}