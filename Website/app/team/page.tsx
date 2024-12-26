'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '../components/navbar'

const teamMembers = [
  {
    name: 'Arpit Sengar',
    role: 'Team Leader',
  image: '/assets/images/chill-guy.png',
  },
  {
    name: 'Lay Sheth',
    role: 'Team Member',
  image: '/assets/images/chill-guy.png',
  },
  {
    name: 'Riya Singh',
    role: 'Team Member',
  image: '/assets/images/chill-guy.png',
  },
  {
    name: 'Bhagyashree Tanwar',
    role: 'Team Member',
  image: '/assets/images/chill-guy.png',
  },
  {
    name: 'Kaustubh Agrawal',
    role: 'Team Member',
  image: '/assets/images/chill-guy.png',
  },
  {
    name: 'Aryan Kumar Singh',
    role: 'Team Member',
  image: '/assets/images/chill-guy.png',
  }
]

export default function TeamSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black-50 text-white">
      <div className="container px-4 md:px-6">
        <Navbar fade={false}/>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-[#6dd1c5]">Our Team</h2>
        <div className="grid gap-8 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={130} 
                height={125}
                className="rounded-full"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

