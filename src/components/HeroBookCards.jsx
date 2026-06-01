import { useState, useEffect } from "react"
import { Star, BookOpen, Hash, Tag } from "lucide-react"

const books = [
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", pages: 412, rating: 4.8, ratings: 24381, googleId: "ywlwAAAAMAAJ", cover: "https://books.google.com/books/content?vid=ISBN9780441013593&printsec=frontcover&img=1&zoom=5", color: "#8B4513" },
  { title: "A Game of Thrones", author: "G.R.R. Martin", genre: "Fantasy", pages: 694, rating: 4.8, ratings: 18293, googleId: "5NomkK4EV68C", cover: "https://books.google.com/books/content?vid=ISBN9780553593716&printsec=frontcover&img=1&zoom=5", color: "#1a1a2e" },
  { title: "Harry Potter", author: "J.K. Rowling", genre: "Fantasy", pages: 309, rating: 4.9, ratings: 52841, googleId: "wrOQLV6xB-wC", cover: "https://books.google.com/books/content?vid=ISBN9780439708180&printsec=frontcover&img=1&zoom=5", color: "#7b2d8b" },
  { title: "1984", author: "George Orwell", genre: "Dystopia", pages: 328, rating: 4.7, ratings: 31204, googleId: "kotPYEqx7kMC", cover: "https://books.google.com/books/content?vid=ISBN9780451524935&printsec=frontcover&img=1&zoom=5", color: "#2c3e50" },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-help", pages: 320, rating: 4.8, ratings: 41023, googleId: "XfFvDwAAQBAJ", cover: "https://books.google.com/books/content?vid=ISBN9780735211292&printsec=frontcover&img=1&zoom=5", color: "#b45309" },
]

// DISABLED
function BookFlipCard({ book, isActive, onClick }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!isActive) setFlipped(false)
  }, [isActive])

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => setFlipped(f => !f), 3000)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div
      className="relative cursor-pointer shrink-0"
      style={{ width: 160, height: 230, perspective: 1000 }}
      onClick={() => { onClick(); if (isActive) setFlipped(f => !f) }}
    >
      <div
        className="relative w-full h-full transition-all duration-700"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >

        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/50 mb-1">{book.genre}</p>
            <p className="text-white font-bold text-sm leading-tight font-serif">{book.title}</p>
            <p className="text-white/50 text-[11px] mt-0.5">{book.author}</p>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-white text-[11px] font-semibold">{book.rating}</span>
          </div>
        </div>

        {/* Back — Stats */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: book.color }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mb-1">{book.genre}</p>
              <p className="text-white font-bold text-base leading-tight font-serif">{book.title}</p>
              <p className="text-white/50 text-[11px] mt-0.5">{book.author}</p>
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              <div className="flex items-center gap-2.5">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(book.rating / 5) * 100}%` }} />
                  </div>
                </div>
                <span className="text-white text-[11px] font-semibold">{book.rating}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <BookOpen className="h-3.5 w-3.5 text-white/50 shrink-0" />
                <span className="text-white/50 text-[11px]">Pages</span>
                <span className="text-white text-[11px] font-semibold ml-auto">{book.pages}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Hash className="h-3.5 w-3.5 text-white/50 shrink-0" />
                <span className="text-white/50 text-[11px]">Ratings</span>
                <span className="text-white text-[11px] font-semibold ml-auto">{book.ratings.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Tag className="h-3.5 w-3.5 text-white/50 shrink-0" />
                <span className="text-white/50 text-[11px]">Genre</span>
                <span className="text-white text-[11px] font-semibold ml-auto">{book.genre}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-[10px] text-white/30 text-center tracking-wide">tap to flip</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroBookCards() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a + 1) % books.length), 6500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center mr-20" style={{ width: 160 * 3, height: 230 }}>

      {books.map((book, i) => {
        const n = books.length
        let offset = i - active
        if (offset > Math.floor(n / 2)) offset -= n
        if (offset < -Math.floor(n / 2)) offset += n

        const isActive = offset === 0
        const absOffset = Math.abs(offset)
        const scale = isActive ? 1 : absOffset === 1 ? 0.88 : 0.76
        const translateX = offset * 148
        const opacity = absOffset > 2 ? 0 : isActive ? 1 : absOffset === 1 ? 0.6 : 0.3

        return (
          <div
            key={book.title}
            className="absolute transition-all duration-700"
            style={{
              transform: `translateX(${translateX}px) scale(${scale})`,
              opacity,
              zIndex: books.length - absOffset,
              left: "50%",
              marginLeft: -80,
            }}
          >
            <BookFlipCard
              book={book}
              isActive={isActive}
              onClick={() => setActive(i)}
            />
          </div>
        )
      })}

    </div>
  )
}