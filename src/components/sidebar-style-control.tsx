"use client"

import * as React from "react"
import { useState, useEffect } from "react"

export function SidebarStyleControl() {
 const [sidebarStyle, setSidebarStyle] = useState<"transparent" | "frosted" | "solid">("transparent")

 useEffect(() => {
 const body = document.body
 body.classList.remove("sidebar-style-transparent", "sidebar-style-frosted", "sidebar-style-solid")
 body.classList.add(`sidebar-style-${sidebarStyle}`)
 }, [sidebarStyle])

 return (
 <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-xs text-slate-100 rounded-lg p-2 shadow-lg border border-slate-800 flex items-center gap-2 select-none font-sans text-xs">
 <span className="font-bold text-slate-400">Sidebar Layout:</span>
 {(["transparent", "frosted", "solid"] as const).map((opt) => (
 <button
 key={opt}
 onClick={() => setSidebarStyle(opt)}
 className={`px-2 py-1 rounded font-semibold capitalize cursor-pointer border-0 ${
 sidebarStyle === opt
 ? "bg-amber-500 text-slate-950 font-bold"
 : "bg-transparent text-slate-300 "
 }`}
 >
 {opt}
 </button>
 ))}
 </div>
 )
}
