"use client"

import { ReactNode, ComponentPropsWithoutRef } from "react"
import Link from "next/link"
import { motion, MotionProps } from "framer-motion"

type ButtonBaseProps = ComponentPropsWithoutRef<"button"> & MotionProps

interface ButtonProps extends Omit<ButtonBaseProps, "children"> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "white"
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
  
  // Base styles dibuat lebih modern dengan tracking dan font-medium/semibold yang seimbang
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 focus:outline-none select-none text-center transform tracking-wide capitalize"
  const widthStyle = fullWidth ? "w-full" : "w-auto"

  const sizeStyles = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  }

  const variantStyles = {
    // Primary: Orange khas Limas Kontraktor dengan shadow glow kontras
    primary: "bg-[#FFCC00] text-[#2D3748] hover:bg-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 border border-transparent",
    
    // Secondary: Menyesuaikan warna Navy utama (#0F2340)
    secondary: "bg-[#0F2340] text-white hover:bg-[#16325c] shadow-lg shadow-blue-950/20 hover:shadow-blue-950/40 border border-transparent",
    
    // Outline: Lebih tipis dan elegan, hover bertransisi ke Navy
    outline: "border border-white/20 text-gray-300 hover:bg-white hover:text-[#0F2340] hover:border-white",
    
    // White: Mewah, clean, cocok untuk dipasang di atas background gelap
    white: "bg-white text-[#0F2340] hover:bg-gray-50 shadow-lg shadow-black/5 hover:shadow-black/10 border border-transparent",
  }

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`

  // Animasi spring dibuat sedikit lebih responsif dan snappy (ala website tech/premium modern)
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