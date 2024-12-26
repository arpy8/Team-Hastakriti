import Image from 'next/image'
import Navbar from '../components/navbar'

const images = [
  { src: '/assets/images/1.webp', alt: 'Gallery Image' },
  { src: '/assets/images/2.jpg', alt: 'Gallery Image' },
  { src: '/assets/images/3.jpg', alt: 'Gallery Image' },
  { src: '/assets/images/4.jpg', alt: 'Gallery Image' },
  { src: '/assets/images/5.jpg', alt: 'Gallery Image' },
  { src: '/assets/images/6.jpg', alt: 'Gallery Image' },
  { src: '/assets/images/7.jpg', alt: 'Gallery Image' },
]

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-black h-screen">
      <Navbar fade={false} />
      {/* <h1 className="text-3xl font-bold my-8 mt-16 text-center text-white">Image Gallery</h1> */}
      {/* <h1 className="text-3xl font-extralight my-8 mt-16 text-left text-[#6dd1c5] animate-fade-in 1s"> */}
      <h1 className="text-3xl font-extralight my-8 mt-16 text-left text-[#6dd1c5] animate-fade-in-1">
        Image Gallery
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in-1.7">
        {images.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={300}
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  )
}