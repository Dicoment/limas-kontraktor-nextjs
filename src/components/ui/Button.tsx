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
  
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none select-none text-center"
  const widthStyle = fullWidth ? "w-full" : "w-auto"

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  }

  const variantStyles = {
    primary: "bg-[#E87722] text-white hover:bg-[#d06a1a] shadow-lg shadow-orange-600/10",
    secondary: "bg-[#1B3A6B] text-white hover:bg-[#142b52] shadow-lg shadow-blue-900/10",
    outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#1B3A6B] hover:border-[#1B3A6B]",
    white: "bg-white text-[#1B3A6B] hover:bg-slate-50 shadow-md",
  }

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`

  // Menggunakan 'as const' di bagian type agar TypeScript membacanya sebagai literal value "spring", bukan string biasa
  const animationProps = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 15 },
  }

  if (href) {
    return (
      <motion.div {...animationProps} className={fullWidth ? "w-full" : "inline-block"}>
        <Link href={href} target={target} rel={rel} className={combinedClasses}>
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