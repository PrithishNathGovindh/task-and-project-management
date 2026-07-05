import { useCallback, useMemo, useState } from 'react'

import { ConfettiContext } from './confetti'

const colors = ['#14b8a6', '#6366f1', '#f43f5e', '#f59e0b', '#22c55e']

function createPieces() {
  return Array.from({ length: 72 }).map((_, index) => ({
    id: `${Date.now()}-${index}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.24,
    duration: 1.8 + Math.random() * 1.2,
    size: 6 + Math.random() * 7,
    color: colors[index % colors.length],
    rotate: Math.random() * 360,
  }))
}

export function ConfettiProvider({ children }) {
  const [pieces, setPieces] = useState([])

  const fireConfetti = useCallback(() => {
    setPieces(createPieces())
    window.setTimeout(() => setPieces([]), 3200)
  }, [])

  const value = useMemo(() => ({ fireConfetti }), [fireConfetti])

  return (
    <ConfettiContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" aria-hidden="true">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className="absolute top-[-1rem] rounded-sm"
            style={{
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.size * 1.6}px`,
              backgroundColor: piece.color,
              animation: `confettiFall ${piece.duration}s ease-in ${piece.delay}s forwards`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </ConfettiContext.Provider>
  )
}
