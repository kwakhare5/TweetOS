'use client'

import { useState, useEffect, useRef } from 'react'
import { Maximize2, X, Check } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
  function openModal() {
    setTempValue(value)
    setIsOpen(true)
    setTimeout(() => {
      modalTextareaRef.current?.focus()
    }, 50)
  }

  // Auto-grow height of textarea based on content
  useEffect(() => {
    const textarea = modalTextareaRef.current
    if (textarea && isOpen) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight + 4}px`
    }
  }, [tempValue, isOpen])

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
        <Textarea
          readOnly
          value={value}
          placeholder={placeholder}
          rows={rows}
          className={`${className} cursor-pointer pointer-events-none select-none pr-10 resize-none`}
        />
        <div 
          onClick={openModal}
          className="absolute inset-0 rounded-xl"
          title="Click to edit in full screen"
        />
        <div className="absolute right-3 top-3 text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-4xl bg-card border rounded-2xl shadow-lg flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30 shrink-0">
              <div>
                <h3 className="text-sm font-semibold tracking-tight">{label}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Editing in Full Screen</p>
              </div>
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col shrink min-h-0 bg-background/50">
              <Textarea
                ref={modalTextareaRef}
                value={tempValue}
                onChange={e => setTempValue(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-background border-none shadow-none focus-visible:ring-0 p-2 text-sm text-foreground resize-none leading-relaxed min-h-[140px] max-h-[50vh] overflow-y-auto ${fontClass}`}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
