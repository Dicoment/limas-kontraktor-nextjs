import React from "react";

/** Class shared untuk input text di sidebar form project. */
export const inputCls =
  "w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87722]/40 focus:border-[#E87722]";

/** Class shared untuk select di sidebar form project. */
export const selectCls =
  "w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87722]/40 cursor-pointer";

/** Pembungkus section di sidebar (judul uppercase + grup field). */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/** Pembungkus satu field (label + input) di sidebar. */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}