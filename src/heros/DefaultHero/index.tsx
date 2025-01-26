'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

export const DefaultHero: React.FC<Page['hero']> = () => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className="relative flex items-center justify-center" data-theme="dark">
      <header className="container mb-8 z-10 relative flex items-center justify-center">
        <h1>Default Hero</h1>
      </header>
    </div>
  )
}
