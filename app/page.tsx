"use client"

import Left from './sections/left'
import Right from './sections/right'

export default function Home() {
  return <main className="flex bg-background overflow-hidden">
    <Left className="h-screen w-[40vw] border-right border-r-2 border-r-muted " />
    <Right className="h-screen w-[60vw]" />
  </main>
}