import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Separator } from '@/components/ui/separator'
import NewsBg from '../assets/news.webp'
import { Clock, BookOpen, Lightbulb, Newspaper } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from '@/components/ui/avatar'


const articles = [
  {
    id: 1,
    category: "Opinion",
    tag: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    icon: <Lightbulb className="h-4 w-4" />,
    title: "The Myth of the 60-Books-a-Year Billionaire",
    subtitle: "Why the reading obsession of the ultra-rich says more about productivity culture than literature",
    date: "May 2025",
    readTime: "4 min read",
    featured: true,
    body: `You've seen the headlines. Elon reads 2 books a day. Bill Gates reads 50 books a year. Warren Buffett spends 80% of his day reading. The implication is always the same: if you want to be successful, you need to read more. A lot more.

But here's the thing nobody says out loud — most of these claims are unverified, cherry-picked, or simply repeated so many times they became "fact." And even if they were true, correlation is not causation. Billionaires also wake up early, drink coffee, and breathe oxygen.

The real damage isn't the lie itself. It's what it does to how people relate to books. Reading stops being a pleasure and becomes a performance metric. People start tracking, competing, optimizing. They choose shorter books to hit their number. They skim to keep up. They feel guilty reading slowly, or rereading, or putting a book down.

Reading 5 books deeply is worth more than skimming 60. A single paragraph that rewires how you see the world is worth more than an entire bestseller you barely remember a week later.

Read at your own pace. Read what you love. Read slowly if that's what it takes to actually absorb something. The goal was never the number — it was always what the book does to you.`
  },
  {
    id: 2,
    category: "Curiosity",
    tag: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Why You Forget Most of What You Read (And Why That's Okay)",
    subtitle: "The science of memory, reading, and why forgetting isn't the enemy",
    date: "April 2025",
    readTime: "3 min read",
    featured: false,
    body: `Most readers feel a quiet guilt about this: you finish a book, someone asks what it was about two months later, and you can barely remember. Did you waste your time?

Neuroscience says no. The brain doesn't store books like hard drives. It processes them, extracts what fits into your existing network of knowledge, and discards the rest. What seems like forgetting is actually filtering.

Hermann Ebbinghaus mapped this in the 1880s with his "forgetting curve" — we lose about 70% of new information within 24 hours unless we actively revisit it. But that doesn't mean reading is useless. It means passive consumption has limits.

What actually sticks: strong emotions tied to a scene, ideas that contradict what you believed before, concepts you immediately applied to real life, and things you explained to someone else. The act of writing a note, even one sentence, dramatically increases retention.

So the goal isn't to remember everything. It's to read in a way that the right things stick — and to make peace with the rest dissolving. You were still changed by what you read, even if you can't name it.`
  },
  {
    id: 3,
    category: "History",
    tag: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    icon: <Newspaper className="h-4 w-4" />,
    title: "The Library That Survived a War — Inside its Own Pages",
    subtitle: "How the librarians of Timbuktu hid 300,000 manuscripts from destruction",
    date: "March 2025",
    readTime: "5 min read",
    featured: false,
    body: `In 2012, when armed groups took control of Timbuktu in northern Mali, they began systematically destroying the city's cultural heritage. Ancient tombs were demolished. Music was banned. And they had their eye on something even more precious: the manuscripts.

Timbuktu had been a center of Islamic scholarship for centuries. Families had quietly preserved hundreds of thousands of manuscripts — covering astronomy, medicine, philosophy, mathematics — in private homes, often for generations. Some dated back to the 13th century.

What followed was one of the most remarkable acts of cultural preservation in modern history. Local librarians and families, working in secret, packed manuscripts into footlockers and rice sacks. They moved them at night, by donkey, by canoe, by any means available. Over months, an estimated 300,000 manuscripts were smuggled to the capital, Bamako, and hidden.

When the occupiers finally reached the main Ahmed Baba library and burned it, they found mostly empty shelves. The books were already gone.

The story barely made international headlines. But it stands as proof that ordinary people — librarians, families, community members — can be the last line of defense for human knowledge. Sometimes saving a book is the most radical thing you can do.`
  },
  {
    id: 4,
    category: "Curiosity",
    tag: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Fiction Makes You More Empathetic. Science Agrees.",
    subtitle: "What happens in your brain when you lose yourself in a character",
    date: "February 2025",
    readTime: "3 min read",
    featured: false,
    body: `For a long time, reading fiction was seen as entertainment — pleasant, but not exactly serious. Then researchers started looking at what actually happens in the brain during deep reading, and the picture got more interesting.

Studies from the University of Toronto and elsewhere found that people who read literary fiction score higher on tests of "theory of mind" — the ability to understand what others are thinking and feeling. Not just after years of reading, but measurably, after a single session.

The mechanism seems to be what researchers call "transportation" — that state where you stop being aware you're reading and start experiencing the story from the inside. When you're deep in a character's perspective, your brain activates the same regions it would if you were actually in that situation. You're not just reading about fear or grief or joy — you're running a simulation of it.

Non-fiction doesn't produce the same effect, at least not to the same degree. The difference seems to be the subjective, interior nature of literary fiction — the access it gives you to another person's inner world, including their doubts, contradictions, and blind spots.

Which is why dismissing novels as "just stories" misses the point entirely. Fiction is one of the only technologies humans have ever invented for getting inside someone else's head.`
  },
]

function NewsPage() {
  const featured = articles.find(a => a.featured)
  const rest = articles.filter(a => !a.featured)

  return (
    <div className='overflow-x-hidden min-h-screen'>
      <Header />

      <div
        className="relative w-full h-65 md:h-80 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${NewsBg})` }}
        >
            <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="px-6 md:px-16 lg:px-32 -mt-52 pb-24">

        {/* Masthead */}
        <div className="text-center py-10 border-b border-border my-10 md:mt-2">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Smart Shelf</p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Reading Room</h1>
          <p className="text-muted-foreground mt-3 text-sm tracking-wide">Curiosities, opinions & stories from the world of books</p>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="mb-12">
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${featured.tag}`}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">{featured.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-border pl-4 italic">{featured.subtitle}</p>
                <p className="text-xs text-muted-foreground">{featured.date}</p>
                <p className="text-sm font-medium">Publisher:</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/95515067?v=4" alt="@pedroparsii" />
                    <AvatarFallback>CN</AvatarFallback>
                    <AvatarBadge className="bg-green-600" />
                  </Avatar>
                  <p className="text-muted-foreground">Pedro Parisi</p>
                </div>
              </div>
              <div className="md:col-span-3 flex flex-col gap-3 border-l border-border pl-8">
                {featured.body.split('\n\n').map((p, i) => (
                  <p key={i} className="text-md leading-relaxed text-foreground/80">{p}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator className="my-10" />

        {/* Rest of articles */}
        <div className="grid md:grid-cols-3 gap-8">
          {rest.map((article, index) => (
            <div key={article.id} className={`flex flex-col gap-4 ${index < rest.length - 1 ? "md:border-r md:border-border md:pr-8" : ""}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${article.tag}`}>
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {article.readTime}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold leading-snug">{article.title}</h3>
              <p className="text-md text-muted-foreground italic">{article.subtitle}</p>
              <Separator />
              <div className="flex flex-col gap-3">
                {article.body.split('\n\n').map((p, i) => (
                  <p key={i} className="text-md leading-relaxed text-foreground/80">{p}</p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-auto pt-2">{article.date}</p>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default NewsPage