import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#6dd1c5] text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
          Join Us in Shaping the Future
        </h2>
        <p className="max-w-[600px] mx-auto text-white/90 md:text-xl mb-8">
          Whether you're a potential patient, partner or innovator, we'd love to connect with you and explore how we can work together to create life-changing solutions.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-transform bg-white text-[#6dd1c5] hover:scale-105 h-11 px-8"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  )
}