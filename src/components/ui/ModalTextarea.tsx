'use client'

import { useState, useEffect, useRef } from 'react'
import { Maximize2, X, Check } from 'lucide-react'

interface ModalTextareaProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  label: string
  className?: string
  rows?: number
  fontClass?: string
}

export default function ModalTextarea({
  value,
  onChange,
  placeholder = '',
  label,
  className = '',
  rows = 3,
  fontClass = 'font-sans'
}: ModalTextareaProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const modalTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync temp value when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempValue(value)
      // Focus the textarea inside the modal after transition
      setTimeout(() => {
        modalTextareaRef.current?.focus()
      }, 50)
    }
  }, [isOpen, value])

  function handleSave() {
    onChange(tempValue)
    setIsOpen(false)
  }

  function handleCancel() {
    setIsOpen(false)
  }

  // Handle escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        handleCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Trigger Area - Looks and acts like a textarea, but clicking opens the modal */}
      <div className="relative group cursor-pointer w-full">
        <textarea
          readOnly
          value={value}
          placeholder={placeholder}
          rows={rows}
          className={`${className} cursor-pointer pointer-events-none select-none pr-10`}
        />
        <div 
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 rounded-xl"
          title="Click to edit in full screen"
        />
        <div className="absolute right-3 top-3 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors pointer-events-none">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-4xl h-[60vh] min-h-[450px] max-h-[90vh] bg-[#0f0f11] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-white/[0.01]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Editing in Full Screen</p>
              </div>
              <button 
                onClick={handleCancel}
                className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 flex flex-col">
              <textarea
                ref={modalTextareaRef}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
                placeholder={placeholder}
                className={`flex-1 w-full bg-[#050505] border border-white/[0.06] rounded-xl p-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/[0.04] transition-all resize-none outline-none leading-relaxed ${fontClass}`}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.05] bg-white/[0.01]">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold rounded-lg text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
