'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/store/useProfileStore'
import Link from 'next/link'

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore()
  const [mounted, setMounted] = useState(false)

  const [name, setName] = useState(profile.name)
  const [twitterHandle, setTwitterHandle] = useState(profile.twitterHandle)
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '')
  const [niche, setNiche] = useState(profile.niche || '')
  const [avoidListString, setAvoidListString] = useState((profile.voice.avoidList || []).join(', '))
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return <div style={{ padding: '20px', fontFamily: 'monospace' }}>Loading...</div>

  function handleSave() {
    const parsedAvoidList = avoidListString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    updateProfile({
      name,
      twitterHandle,
      geminiApiKey,
      niche,
      voice: {
        ...profile.voice,
        avoidList: parsedAvoidList,
      },
    })
    setMessage('Settings saved!')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'monospace', padding: '10px' }}>
      <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>DNA Settings</h1>
        <Link href="/" style={{ fontSize: '12px', textDecoration: 'underline', color: 'blue' }}>
          Back
        </Link>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>TWITTER HANDLE</label>
          <input
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>NICHE</label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>GEMINI API KEY</label>
          <input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>AVOID WORDS (comma-separated)</label>
          <input
            type="text"
            value={avoidListString}
            onChange={(e) => setAvoidListString(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {message && <div style={{ padding: '8px', background: '#dfd', color: 'green' }}>{message}</div>}

        <button
          onClick={handleSave}
          style={{ padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
