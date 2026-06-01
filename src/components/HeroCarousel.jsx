import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { Star } from "lucide-react"
import { Link } from "react-router"

const featuredBooks = [
  { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", rating: 4.8, openlibraryId: "OL893415W", cover: "https://books.google.com/books/content?vid=ISBN9780441013593&printsec=frontcover&img=1&zoom=1" },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", rating: 4.9, openlibraryId: "OL8479867W", cover: "https://books.google.com/books/content?vid=ISBN9780756404741&printsec=frontcover&img=1&zoom=1" },
  { title: "1984", author: "George Orwell", genre: "Dystopia", rating: 4.7, openlibraryId: "OL1168083W", cover: "https://books.google.com/books/content?vid=ISBN9780451524935&printsec=frontcover&img=1&zoom=1" },
  { title: "It", author: "Stephen King", genre: "Horror", rating: 4.6, openlibraryId: "OL81613W", cover: "https://books.google.com/books/content?vid=ISBN9781501142970&printsec=frontcover&img=1&zoom=1" },
  { title: "Pride & Prejudice", author: "Jane Austen", genre: "Romance", rating: 4.8, openlibraryId: "OL66554W", cover: "https://books.google.com/books/content?vid=ISBN9780141439518&printsec=frontcover&img=1&zoom=1" },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", rating: 4.9, openlibraryId: "OL82563W", cover: "https://books.google.com/books/content?vid=ISBN9780439708180&printsec=frontcover&img=1&zoom=1" },
  { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", rating: 4.8, openlibraryId: "OL257943W", cover: "https://books.google.com/books/content?vid=ISBN9780553593716&printsec=frontcover&img=1&zoom=1" },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "Self-help", rating: 4.7, openlibraryId: "OL796465W", cover: "https://books.google.com/books/content?vid=ISBN9780062315007&printsec=frontcover&img=1&zoom=1" },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-help", rating: 4.8, openlibraryId: "OL17930368W", cover: "https://books.google.com/books/content?vid=ISBN9780735211292&printsec=frontcover&img=1&zoom=1" },
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", rating: 4.9, openlibraryId: "OL27513W", cover: "https://books.google.com/books/content?vid=ISBN9780618640157&printsec=frontcover&img=1&zoom=1" },
]

function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }))

  return (
      <div className="relative w-full">
        <div className="absolute left-0 top-12 h-full w-16 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-12 h-full w-16 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <Carousel
          plugins={[plugin.current]}
          opts={{ align: "center", loop: true }}
          className="w-full max-w-full pt-12"
        >
          <CarouselContent className="-ml-2">
            {featuredBooks.map((book) => (
              <CarouselItem key={book.title} className="pl-2 basis-50 lg:basis-60 ">
                <Link to={`/book/${book.openlibraryId}`}>
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg ">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <span className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      {book.genre}
                    </span>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-white font-medium">{book.rating}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
                    <h3 className="text-white font-semibold text-lg leading-tight">{book.title}</h3>
                    <p className="text-white/60 text-sm">{book.author}</p>
                  </div>
                </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
  )
}

export default HeroCarousel