import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Gallery',
  description: 'A beautiful collection of images',
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  )
}

