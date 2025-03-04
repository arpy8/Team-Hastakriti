import { Metadata } from 'next'
import AboutHero from './components/about-hero'
import MissionStatement from './components/mission'
// import TeamSection from './components/team'
import CallToAction from './components/cto'

export const metadata: Metadata = {
  title: 'About Us | InnoHand Prosthetics',
  description: 'Learn about InnoHand Prosthetics, our mission, and our dedicated team committed to improving lives through innovative prosthetic hand solutions.',
}

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <AboutHero />
      <MissionStatement />
      {/* <TeamSection /> */}
      <CallToAction />
    </main>
  )
}