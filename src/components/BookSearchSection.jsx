import { useBookSearch } from "../hooks/useBookSearch.js"
import { BookSearch, BooksPagination } from "./BookSearch.jsx"
import BookCard from "./BookCard.jsx"
import { Loader2, SearchX } from "lucide-react"

function BookSearchSection() {
  const { books, loading, error, filters, setFilter, submitSearch, pagination } = useBookSearch(12)

  return (
    <div>
      <div>
        <h2 className="text-2xl">Search books</h2>
        <p className="text-muted-foreground">
          Find your next favorite book in our extensive collection.
        </p>
      </div>

      <BookSearch filters={filters} onFilterChange={setFilter} onSearchSubmit={submitSearch} />

      {loading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Searching books...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <SearchX className="h-8 w-8" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <SearchX className="h-8 w-8" />
          <p className="text-sm">No books found. Try different search terms.</p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 py-2">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <BooksPagination pagination={pagination} />
        </>
      )}
    </div>
  )
}

export default BookSearchSection