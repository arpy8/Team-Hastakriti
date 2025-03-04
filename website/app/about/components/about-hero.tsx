import Image from 'next/image'
import Navbar from '../../components/navbar'

export default function AboutHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black-100 h-screen">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] animate-fade-in-1">
          <Navbar fade={false} />
          <Image
            src="/assets/images/sample-image.png"
            alt="A person using an InnoHand prosthetic hand to perform daily tasks"
            width={600}
            height={400}
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg shadow-[#6dd1c580] animate-fade-in-1"
          />
          <div className="flex flex-col justify-center space-y-4 w-full h-full">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#6dd1c5]">
                Empowering Lives Through Innovation
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                At Hastakriti, we're dedicated to restoring independence and improving quality of life through cutting-edge affordable prosthetic hand technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}