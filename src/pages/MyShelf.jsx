import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Bookmark, BookMarked, Trophy, Lock, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import BookCard from '@/components/BookCard.jsx'
import PageLoader from '@/components/PageLoader.jsx'
import ReadingStats from '@/components/ReadingStats.jsx'
import { useProfile } from '@/hooks/useProfile'
import { useShelf } from '@/hooks/useShelf'
import { signOut } from '@/lib/auth'
import { calculateAchievements } from '@/lib/achievements'
import { rowToBook } from '@/lib/userBooks'
import { genreByKey } from '@/lib/genres'
import { getInitials } from '@/lib/utils'

const TABS = [
  { key: "saved",   label: "Saved",   icon: Bookmark   },
  { key: "reading", label: "Reading", icon: BookOpen   },
  { key: "read",    label: "Read",    icon: BookMarked },
]

function MyShelf() {
  const navigate = useNavigate()
  const { profile, genres, goal, loading: profileLoading } = useProfile()
  const { rows, loading: shelfLoading } = useShelf()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/login')
    } catch {
      toast.error("Couldn't sign out. Try again.")
    }
  }

  if (profileLoading || shelfLoading) return <PageLoader />

  const achievements = calculateAchievements({ rows, goal, memberSince: profile?.created_at })
  const memberSince  = profile?.created_at &&
    new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 flex flex-col gap-10 mt-20">

      {/* Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="w-24 h-24 text-2xl">
          <AvatarImage src={profile?.avatar_url ?? undefined} />
          <AvatarFallback>{getInitials(profile?.display_name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile?.display_name ?? 'Your Shelf'}</h1>
          <p className="text-muted-foreground max-w-md">{profile?.bio ?? 'No bio yet...'}</p>
          {memberSince && <p className="text-xs text-muted-foreground">Member since {memberSince}</p>}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              {genres.map((key) => (
                <Badge key={key} variant="secondary" className="text-xs">{genreByKey(key)?.label ?? key}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex mt-2 gap-2 md:ml-auto md:self-end max-md:self-center">
          <Button className="w-30" asChild>
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
          <Button variant='destructive' onClick={handleSignOut}>
            <LogOut /> Sign Out
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Reading Stats</h2>
        <ReadingStats rows={rows} goal={goal} />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`relative flex flex-col items-center text-center gap-2 p-5 rounded-xl border border-border transition-colors
                ${a.unlocked ? "bg-card" : "bg-muted/40 opacity-40 grayscale"}`}
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
        <Tabs defaultValue="saved">
          <TabsList className="gap-2 max-sm:w-full">
            {TABS.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key}><Icon className="h-4 w-4 mr-1" /> {label}</TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ key }) => {
            const books = rows.filter((r) => r.status === key)
            return (
              <TabsContent key={key} value={key}>
                {books.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                    <Bookmark className="h-8 w-8" />
                    <p className="text-sm">No books here yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-4">
                    {books.map((r) => <BookCard key={r.id} book={rowToBook(r)} />)}
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>

    </div>
  )
}

export default MyShelf
