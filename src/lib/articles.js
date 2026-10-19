// Reading Room articles. Paragraphs are separated by blank lines.
export const ARTICLES = [
  {
    slug:     "reading-billionaire-myth",
    category: "Opinion",
    title:    "The Myth of the 60-Books-a-Year Billionaire",
    subtitle: "Why the reading obsession of the ultra-rich says more about productivity culture than literature",
    date:     "May 2025",
    readTime: "4 min read",
    body: `You've seen the headlines. Elon reads 2 books a day. Bill Gates reads 50 books a year. Warren Buffett spends 80% of his day reading. The implication is always the same: if you want to be successful, you need to read more. A lot more.

But here's the thing nobody says out loud — most of these claims are unverified, cherry-picked, or simply repeated so many times they became "fact." And even if they were true, correlation is not causation. Billionaires also wake up early, drink coffee, and breathe oxygen.

The real damage isn't the lie itself. It's what it does to how people relate to books. Reading stops being a pleasure and becomes a performance metric. People start tracking, competing, optimizing. They choose shorter books to hit their number. They skim to keep up. They feel guilty reading slowly, or rereading, or putting a book down.

Reading 5 books deeply is worth more than skimming 60. A single paragraph that rewires how you see the world is worth more than an entire bestseller you barely remember a week later.

Read at your own pace. Read what you love. Read slowly if that's what it takes to actually absorb something. The goal was never the number — it was always what the book does to you.`,
  },
  {
    slug:     "why-you-forget-what-you-read",
    category: "Curiosity",
    title:    "Why You Forget Most of What You Read (And Why That's Okay)",
    subtitle: "The science of memory, reading, and why forgetting isn't the enemy",
    date:     "April 2025",
    readTime: "3 min read",
    body: `Most readers feel a quiet guilt about this: you finish a book, someone asks what it was about two months later, and you can barely remember. Did you waste your time?

Neuroscience says no. The brain doesn't store books like hard drives. It processes them, extracts what fits into your existing network of knowledge, and discards the rest. What seems like forgetting is actually filtering.

Hermann Ebbinghaus mapped this in the 1880s with his "forgetting curve" — we lose about 70% of new information within 24 hours unless we actively revisit it. But that doesn't mean reading is useless. It means passive consumption has limits.

What actually sticks: strong emotions tied to a scene, ideas that contradict what you believed before, concepts you immediately applied to real life, and things you explained to someone else. The act of writing a note, even one sentence, dramatically increases retention.

So the goal isn't to remember everything. It's to read in a way that the right things stick — and to make peace with the rest dissolving. You were still changed by what you read, even if you can't name it.`,
  },
  {
    slug:     "timbuktu-manuscripts",
    category: "History",
    title:    "The Library That Survived a War — Inside its Own Pages",
    subtitle: "How the librarians of Timbuktu hid 300,000 manuscripts from destruction",
    date:     "March 2025",
    readTime: "5 min read",
    body: `In 2012, when armed groups took control of Timbuktu in northern Mali, they began systematically destroying the city's cultural heritage. Ancient tombs were demolished. Music was banned. And they had their eye on something even more precious: the manuscripts.

Timbuktu had been a center of Islamic scholarship for centuries. Families had quietly preserved hundreds of thousands of manuscripts — covering astronomy, medicine, philosophy, mathematics — in private homes, often for generations. Some dated back to the 13th century.

What followed was one of the most remarkable acts of cultural preservation in modern history. Local librarians and families, working in secret, packed manuscripts into footlockers and rice sacks. They moved them at night, by donkey, by canoe, by any means available. Over months, an estimated 300,000 manuscripts were smuggled to the capital, Bamako, and hidden.

When the occupiers finally reached the main Ahmed Baba library and burned it, they found mostly empty shelves. The books were already gone.

The story barely made international headlines. But it stands as proof that ordinary people — librarians, families, community members — can be the last line of defense for human knowledge. Sometimes saving a book is the most radical thing you can do.`,
  },
  {
    slug:     "fiction-and-empathy",
    category: "Curiosity",
    title:    "Fiction Makes You More Empathetic. Science Agrees.",
    subtitle: "What happens in your brain when you lose yourself in a character",
    date:     "February 2025",
    readTime: "3 min read",
    body: `For a long time, reading fiction was seen as entertainment — pleasant, but not exactly serious. Then researchers started looking at what actually happens in the brain during deep reading, and the picture got more interesting.

Studies from the University of Toronto and elsewhere found that people who read literary fiction score higher on tests of "theory of mind" — the ability to understand what others are thinking and feeling. Not just after years of reading, but measurably, after a single session.

The mechanism seems to be what researchers call "transportation" — that state where you stop being aware you're reading and start experiencing the story from the inside. When you're deep in a character's perspective, your brain activates the same regions it would if you were actually in that situation. You're not just reading about fear or grief or joy — you're running a simulation of it.

Non-fiction doesn't produce the same effect, at least not to the same degree. The difference seems to be the subjective, interior nature of literary fiction — the access it gives you to another person's inner world, including their doubts, contradictions, and blind spots.

Which is why dismissing novels as "just stories" misses the point entirely. Fiction is one of the only technologies humans have ever invented for getting inside someone else's head.`,
  },
]

export const CATEGORY_STYLES = {
  Opinion:   "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  Curiosity: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  History:   "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
}

export const AUTHOR = { name: "Pedro Parisi", avatar: "https://avatars.githubusercontent.com/u/95515067?v=4" }

export const articleBySlug = (slug) => ARTICLES.find((a) => a.slug === slug)
