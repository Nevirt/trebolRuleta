'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true })
    cache.compat = true
    return cache
  })

  useServerInsertedHTML(() => {
    const inserted = cache.inserted
    const names = Object.keys(inserted)
    if (names.length === 0) {
      return null
    }
    let styles = ''
    for (const name of names) {
      const style = inserted[name]
      if (typeof style === 'string') {
        styles += style
      }
    }
    const emotionKey = `${cache.key} ${names.join(' ')}`
    return (
      <style
        data-emotion={emotionKey}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
