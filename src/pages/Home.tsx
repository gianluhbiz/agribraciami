import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { Ash } from '../sections/Ash'
import { Day } from '../sections/Day'
import { Fire } from '../sections/Fire'
import { Gift } from '../sections/Gift'
import { Hero } from '../sections/Hero'
import { MenuTeaser } from '../sections/MenuTeaser'
import { Origins } from '../sections/Origins'
import { Rooms } from '../sections/Rooms'
import { Table } from '../sections/Table'
import { Visit } from '../sections/Visit'
import { Voices } from '../sections/Voices'

export default function Home() {
  const { hash } = useLocation()
  useEffect(() => {
    document.title = 'Braciami · Agriturismo e braceria a Viterbo'
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
  }, [hash])

  return (
    <main>
      <Hero />
      <Fire />
      <Origins />
      <MenuTeaser />
      <Table />
      <Rooms />
      <Day />
      <Ash />
      <Voices />
      <Gift />
      <Visit />
    </main>
  )
}
