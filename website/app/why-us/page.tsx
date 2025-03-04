import { Metadata } from 'next'
import Navbar from '../components/navbar'

export const metadata: Metadata = {
  title: 'Why Us | Hastakriti',
  description: 'Learn about Hastakriti, our mission, and our dedicated team committed to improving lives through innovative prosthetic hand solutions.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-black h-screen">
      <Navbar fade={false} />
      <h1 className="text-3xl font-extralight my-8 mt-16 text-left text-[#6dd1c5]">
        Why Us?
      </h1>
      {/* <hr className='border-gray-500 w-1/12 mx-auto' /> */}
    </div>
  )
}