"use client"

import { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export default function Input({ error, className = "", ...props }: InputProps) {
  const errorClass = error ? "border-red-500 focus:ring-red-500" : "border-slate-300"
  return (
    <input
      className={`w-full px-3 py-2 rounded ${errorClass} ${className}`}
      {...props}
    />
  )
}