import { Button } from '@/components/ui/button'
import HeroCarousel from '@/components/HeroCarousel.jsx'
import ReadingStats from '@/components/ReadingStats.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import GenresOverview from '@/components/Genres.jsx'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useShelf } from '@/hooks/useShelf'
import { useProfile } from '@/hooks/useProfile'

function Home() {
  const { user } = useAuth()

  return (
    <>
      <div id="hero" className="bg-card flex flex-col lg:flex-row items-center justify-between px-8 md:px-22 lg:px-48 py-32 gap-20 select-none">
        <div className="flex flex-col gap-4">
          <h1 className='text-6xl font-medium'>Find and Track <br/>
              Your Books
          </h1>
          <p className="text-muted-foreground">Discover, organize, and track your reading journey with our smart shelf. <br/> Your personal library, reimagined.</p>
          <Button className="w-30 hover:bg-contrast hover:text-white" asChild>
            <Link to={user ? "/shelf" : "/signup"}>{user ? "My Shelf" : "Get Started"}</Link>
          </Button>
        </div>
      </div>

      <div id="home-content" className="flex flex-col py-18 px-6 md:px-16 lg:px-32 gap-18">

        <div>
          <div>
            <h2 className="text-2xl">Classics</h2>
            <p className='text-muted-foreground'>Discover timeless stories that have shaped literature and culture.</p>
          </div>
          <HeroCarousel />
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl">Reading Stats</h2>
            <p className="text-muted-foreground">A snapshot of your reading journey.</p>
          </div>
          {user ? <UserStats /> : (
            <div className="flex flex-col items-center gap-3 p-10 rounded-xl border border-border bg-card text-center">
              <p className="text-muted-foreground">Create a free account to track your books, goals and favorite genres.</p>
              <Button asChild><Link to="/signup">Get Started</Link></Button>
            </div>
          )}
        </div>

        <Separator />

        <GenresOverview />

      </div>
    </>
  )
}

function UserStats() {
  const { rows } = useShelf()
  const { goal } = useProfile()
  return <ReadingStats rows={rows} goal={goal} />
}

export default Home
