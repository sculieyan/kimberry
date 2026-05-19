import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="relative h-screen">
      <video
        autoPlay
        muted
        playsInline
        preload='metadata'
        className="absolute w-full h-full object-cover"
        poster="/poster.jpg"
      >
        <source 
          src="https://amplify-mynextjspostgres--kimberryhomestoragebucke-hynjyaubcbzh.s3.ap-southeast-2.amazonaws.com/profile-image/home.webm" 
          type="video/webm" 
        />
        <Image
          src="/poster.jpg"
          alt="Kimberry"
          fill
          priority
          loading="eager"
          className="object-cover"
        />
      </video>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pure Dairy Products from New Zealand
          </h1>
          <h3 className="text-xl md:text-2xl mb-8">
            Pure New Zealand, pure quality, no additives
          </h3>
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-josefin">
            <Link href={'/about'}>Learn More</Link>
          </button>
        </div>
      </div>
    </div>
  )
}