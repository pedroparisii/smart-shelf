import Header from '@/components/Header.jsx'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer.jsx'
import HeroCarousel from '@/components/HeroCarousel.jsx'
import ReadingStats from '@/components/ReadingStats.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import GenresOverview from '@/components/Genres.jsx'
import { Link } from 'react-router'

function Home() {

  return (
    <div className='min-h-screen overflow-x-hidden'>
      <Header />

      <div id="hero" className="bg-card flex flex-col lg:flex-row items-center justify-between px-8 md:px-22 lg:px-48 py-32  gap-20  select-none">
        <div className="flex flex-col gap-4">
          <h1 className='text-6xl font-medium'>Find and Track <br/>
              Your Books
          </h1>
          <p className="text-muted-foreground">Discover, organize, and track your reading journey with our smart shelf. <br/> Your personal library, reimagined.</p>
          <Link to="/signup">
            <Button className="w-30 hover:bg-[#cf7412] hover:text-white">Get Started</Button>
          </Link>
        </div>
      </div>

      <div id="home-content" className=" h-1/2 flex flex-col py-18 px-6 md:px-16 lg:px-32 gap-18">

        <div className=''>
          <div>
            <h2 className="text-2xl" >Classics</h2>
            <p className='text-muted-foreground'>Discover timeless stories that have shaped literature and culture.</p>
          </div>
          <HeroCarousel />
        </div>

        <Separator />

        <ReadingStats />
        
        <Separator />

        <GenresOverview />

      </div>

      <Footer />
      
    </div>
  )
}

export default Home