"use client"

import { ReactNode, ComponentPropsWithoutRef } from "react"
import Link from "next/link"
import { motion, MotionProps } from "framer-motion"

type ButtonBaseProps = ComponentPropsWithoutRef<"button"> & MotionProps

interface ButtonProps extends Omit<ButtonBaseProps, "children"> {
  children: ReactNode
  // Tambahkan variant 'outline-dark' untuk section ber-background terang
  variant?: "primary" | "secondary" | "outline" | "outline-dark" | "white"
  size?: "sm" | "md" | "lg"
  href?: string
  target?: string
  rel?: string
  className?: string
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  className = "",
  fullWidth = false,
  ...props
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none select-none text-center transform tracking-wide capitalize"
  const widthStyle = fullWidth ? "w-full" : "w-auto"

  const sizeStyles = {
    sm: "px-5 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  }

  const variantStyles = {
    primary: "bg-[#FFCC00] text-[#2D3748] hover:bg-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 border border-transparent",
    
    secondary: "bg-[#0F2340] text-white hover:bg-[#16325c] shadow-lg shadow-blue-950/20 hover:shadow-blue-950/40 border border-transparent",
    
    // Outline khusus untuk background gelap
    outline: "border border-white/20 text-gray-300 hover:bg-white hover:text-[#0F2340] hover:border-white",
    
    // VARIANT BARU: Outline khusus untuk background terang (seperti Credibility Section)
    "outline-dark": "border border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 bg-transparent",
    
    white: "bg-white text-[#0F2340] hover:bg-gray-50 shadow-lg shadow-black/5 hover:shadow-black/10 border border-transparent",
  }

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`

  const animationProps = {
    whileHover: { scale: 1.02, y: -1.5 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 500, damping: 18 },
  }

  if (href) {
    return (
      <motion.div 
        {...animationProps} 
        className={fullWidth ? "w-full flex" : "inline-flex"}
      >
        <Link 
          href={href} 
          target={target} 
          rel={rel} 
          className={combinedClasses}
        >
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      {...animationProps}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.button>
  )
}