import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clipboard, X, Check, Search, AtSign, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProfile } from '@/types'
import { generateTrendingPacket, generateEngagementPacket } from '@/lib/grok-packager'

interface HuntModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'topic' | 'engagement'
  profile: UserProfile
  onRunApify: (keywords: string[], targetAccounts?: string[]) => Promise<void>
  isLoading?: boolean
}

export function HuntModal({ isOpen, onClose, type, profile, onRunApify, isLoading = false }: HuntModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [mode, setMode] = useState<'apify' | 'manual' | null>(null)
  const [copied, setCopied] = useState(false)

  // Pre-fill keywords
  const defaultKeywords = type === 'topic'
    ? [...new Set([profile.niche, ...(profile.contentPillars?.map(p => p.name) || [])])]
    : [...new Set([profile.niche, ...(profile.audience?.audienceProblems || [])])]
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords.slice(0, 3).filter(Boolean))
  const [newKeyword, setNewKeyword] = useState('')

  // Pre-fill target accounts for engagement
  const defaultAccounts = profile.admiredAccounts || []
  const [accounts, setAccounts] = useState<string[]>(defaultAccounts)
  const [newAccount, setNewAccount] = useState('')

  const handleManualCopy = async () => {
    let packet = ''
    if (type === 'topic') {
      packet = generateTrendingPacket(profile, { mode: 'trending', focusAreas: keywords })
    } else {
      packet = generateEngagementPacket(profile, { mode: 'engagement', targetAccounts: accounts, topicKeywords: keywords, opportunityTypes: ['reply', 'quote_tweet'] })
    }
    
    await navigator.clipboard.writeText(packet)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onClose()
      setStep(1)
      setMode(null)
    }, 2000)
  }

  const handleSelectMode = (selectedMode: 'apify' | 'manual') => {
    setMode(selectedMode)
    if (selectedMode === 'manual') {
      handleManualCopy()
    } else {
      setStep(2)
    }
  }

  const handleRunApify = async () => {
    await onRunApify(keywords, type === 'engagement' ? accounts : undefined)
    onClose()
    setStep(1)
    setMode(null)
  }

  const addKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (k: string) => {
    setKeywords(keywords.filter(keyword => keyword !== k))
  }

  const addAccount = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newAccount.trim() && !accounts.includes(newAccount.trim())) {
      const cleanHandle = newAccount.trim().replace(/^@/, '')
      setAccounts([...accounts, cleanHandle])
      setNewAccount('')
    }
  }

  const removeAccount = (a: string) => {
    setAccounts(accounts.filter(account => account !== a))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-background rounded-xl shadow-xl border border-amber-900/10 overflow-hidden"
      >
        {/* Washi tape detail */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-200/40 opacity-70" />
        
        <div className="flex items-center justify-between p-4 border-b border-amber-900/10">
          <h2 className="font-sans font-medium text-amber-950 flex items-center gap-2">
            {type === 'topic' ? 'Topic Hunt' : 'Engagement Hunt'}
          </h2>
          <button onClick={onClose} aria-label="Close modal" className="text-muted-foreground hover:text-foreground p-1 rounded-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-amber-900/60 font-sans mb-6">
                  Select how you want to run this hunt. Apify will cost API credits but runs automatically. Manual generates a copy-paste packet for Grok.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelectMode('apify')}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-card border border-amber-900/10 rounded-xl hover:border-amber-500/30 hover:shadow-sm hover:scale-[1.02] transition-all active:scale-[0.98] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-amber-950">Apify Auto ⚡</div>
                      <div className="text-xs text-amber-900/60 mt-1">Uses API credits</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectMode('manual')}
                    disabled={mode === 'manual'}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-card border border-amber-900/10 rounded-xl hover:border-slate-500/30 hover:shadow-sm hover:scale-[1.02] transition-all active:scale-[0.98] group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                      {copied ? <Check size={24} className="text-green-600" /> : <Clipboard size={24} />}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-amber-950">
                        {copied ? 'Copied!' : 'Grok Manual 📋'}
                      </div>
                      <div className="text-xs text-amber-900/60 mt-1">Zero cost, paste in Grok</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {type === 'engagement' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-900/60 uppercase tracking-wider">
                      Target Accounts
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {accounts.map(acc => (
                        <span key={acc} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-sm rounded-md font-sans">
                          @{acc}
                          <button onClick={() => removeAccount(acc)} aria-label={`Remove account ${acc}`} className="hover:text-foreground rounded-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"><X size={14} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" />
                      <input
                        type="text"
                        placeholder="Add handle and press Enter"
                        value={newAccount}
                        onChange={(e) => setNewAccount(e.target.value)}
                        onKeyDown={addAccount}
                        className="w-full pl-8 pr-3 py-2 bg-card border border-amber-900/20 rounded-lg text-sm text-amber-950 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-900/60 uppercase tracking-wider">
                    {type === 'topic' ? 'Search Keywords' : 'Fallback Keywords'}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {keywords.map(kw => (
                      <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-card border border-amber-900/20 text-amber-900 text-sm rounded-md font-sans shadow-sm">
                        {kw}
                        <button onClick={() => removeKeyword(kw)} aria-label={`Remove keyword ${kw}`} className="hover:text-foreground rounded-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/40" />
                    <input
                      type="text"
                      placeholder="Add keyword and press Enter"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={addKeyword}
                      className="w-full pl-8 pr-3 py-2 bg-card border border-amber-900/20 rounded-lg text-sm text-amber-950 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-amber-900/10">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-sm font-medium text-amber-900/60 hover:text-amber-950 transition-colors"
                  >
                    Back
                  </button>
                  <Button
                    onClick={handleRunApify}
                    disabled={isLoading || (keywords.length === 0 && accounts.length === 0)}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    ) : (
                      <Play size={16} className="mr-2 fill-current" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
