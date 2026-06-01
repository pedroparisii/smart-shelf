import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Bookmark, BookMarked, Target, Trophy, Lock, LogOut, Loader2 } from 'lucide-react'
import BookCard from '@/components/BookCard.jsx'
import { useProfile, useShelfStats } from '@/hooks/useProfile'
import { useAuth, signOut } from '@/hooks/useAuth'
import { getShelfBooks, dbBookToAppBook, getUserGenres } from '@/lib/userBooks'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { getUserBooksWithGenres, calculateAchievements } from '@/lib/achievements'



function formatMemberSince(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getInitials(name) {
  if (!name) return '??'
  return name.trim().slice(0, 2).toUpperCase()
}

function MyShelf() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()
  const { stats, goal, loading: statsLoading } = useShelfStats()
  const [userGenres, setUserGenres] = useState([])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("saved")
  const [shelfBooks, setShelfBooks] = useState([])
  const [shelfLoading, setShelfLoading] = useState(false)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    if (!user) return
    setShelfLoading(true)
    getShelfBooks(user.id, activeTab)
      .then(rows => setShelfBooks(rows.map(r => dbBookToAppBook(r.books))))
      .catch(() => setShelfBooks([]))
      .finally(() => setShelfLoading(false))
    getUserGenres(user.id)
    .then(setUserGenres)
    .catch(() => {})
  }, [user, activeTab])

  useEffect(() => {
    if (!user || statsLoading) return
    getUserBooksWithGenres(user.id)
      .then(userBooks => {
        const result = calculateAchievements({
          stats,
          goal,
          memberSince: profile?.created_at,
          userBooks,
        })
        setAchievements(result)
      })
      .catch(() => {})
  }, [user, stats, goal, statsLoading, profile])

  const goalPercent = goal ? Math.min(100, Math.round((stats.read / goal) * 100)) : 0

  const metrics = [
    { label: "Read",        value: stats.read,    icon: <BookMarked className="h-5 w-5" />, color: "text-blue-400"   },
    { label: "Reading",     value: stats.reading, icon: <BookOpen   className="h-5 w-5" />, color: "text-green-400"  },
    { label: "Saved",       value: stats.saved,   icon: <Bookmark   className="h-5 w-5" />, color: "text-purple-400" },
    { label: "Annual Goal", value: goal ? `${stats.read}/${goal}` : "—", icon: <Target className="h-5 w-5" />, color: "text-orange-400" },
  ]

  if (profileLoading) {
    return (
      <div className="overflow-x-hidden min-h-screen">
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-x-hidden min-h-screen'>
      <Header />

      <div className="px-6 md:px-16 lg:px-24 py-12 flex flex-col gap-10 mt-20 relative">

        {/* Profile */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 text-2xl">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{getInitials(profile?.display_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-3xl font-bold">{profile?.display_name ?? 'Your Shelf'}</h1>
            <p className="text-muted-foreground max-w-md">
              {profile?.bio ?? 'No bio yet...'}
            </p>
            {profile?.created_at && (
              <p className="text-xs text-muted-foreground">Member since {formatMemberSince(profile.created_at)}</p>
            )}
            {userGenres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {userGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </Badge>
                ))}
              </div>
            )}
            
          </div>
          <div className="flex mt-2 gap-2 self-end right-30 md:absolute  max-md:self-center">
              <Button className="w-30" asChild>
                <Link to="/profile/edit">Edit Profile</Link>
              </Button>
              <Button variant='destructive' onClick={handleSignOut}>
                <LogOut /> Sign Out
              </Button>
            </div>
        </div>

        <Separator />

        {/* Metrics */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Reading Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
                <div className={m.color}>{m.icon}</div>
                <span className="text-3xl font-semibold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : m.value}
                </span>
                <span className="text-sm text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
          {goal && (
            <div className="flex flex-col gap-2 p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" /> Annual Goal
                </span>
                <span className="text-muted-foreground">
                  {stats.read} of {goal} books — {goalPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${goalPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Achievements */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Achievements</h2>
            <Badge variant="secondary" className="ml-1">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none cursor-pointer">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`relative flex flex-col items-center text-center gap-2 p-5 rounded-xl border transition-colors
                  ${a.unlocked
                    ? "bg-card border-border"
                    : "bg-muted/40 border-border opacity-40 grayscale"
                  }`}
              >
                {!a.unlocked && <Lock className="absolute top-3 right-3 h-3 w-3 text-muted-foreground" />}
                <span className="text-3xl">{a.icon}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{a.label}</span>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shelf */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">My Shelf</h2>
          <Tabs defaultValue="saved" onValueChange={setActiveTab}>
            <TabsList className="gap-2 max-sm:w-full">
              <TabsTrigger value="saved">
                <Bookmark className="h-4 w-4 mr-1" /> Saved
              </TabsTrigger>
              <TabsTrigger value="reading">
                <BookOpen className="h-4 w-4 mr-1" /> Reading
              </TabsTrigger>
              <TabsTrigger value="read">
                <BookMarked className="h-4 w-4 mr-1" /> Read
              </TabsTrigger>
            </TabsList>

            {["saved", "reading", "read"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                {shelfLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : shelfBooks.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                    <Bookmark className="h-8 w-8" />
                    <p className="text-sm">No books here yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 my-4">
                    {shelfBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default MyShelf