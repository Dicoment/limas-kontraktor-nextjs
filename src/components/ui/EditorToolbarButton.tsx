"use client";

import React from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Tombol toolbar generik untuk rich text editor (Tiptap, dll).
 * Reusable di editor manapun — project, artikel, dsb.
 */
export function ToolbarButton({ onClick, active, title, disabled, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded w-8 h-8 flex items-center justify-center transition-all text-[15px] flex-shrink-0 ${
        active ? "bg-[#E87722] text-white" : "hover:bg-[#2c3338] text-[#a7aaad] hover:text-white"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

/** Divider vertikal antar grup tombol toolbar. */
export function ToolbarDivider() {
  return <div className="w-px h-5 bg-[#3c434a] mx-0.5 flex-shrink-0" />;
}