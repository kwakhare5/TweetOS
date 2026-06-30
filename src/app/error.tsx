'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '16px' }}>
      <div style={{ maxWidth: '380px', width: '100%', padding: '24px', border: '1px solid red', textAlign: 'center' }}>
        <h2 style={{ color: 'red', margin: '0 0 10px 0' }}>Something went wrong</h2>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px', wordBreak: 'break-all' }}>{error.message}</p>
        <button
          onClick={reset}
          style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
