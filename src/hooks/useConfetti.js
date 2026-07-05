import { useContext } from 'react'

import { ConfettiContext } from '../context/confetti'

export function useConfetti() {
  const context = useContext(ConfettiContext)

  if (!context) {
    throw new Error('useConfetti must be used within ConfettiProvider')
  }

  return context
}
