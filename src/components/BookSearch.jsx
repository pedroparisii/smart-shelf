import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, SelectGroup, SelectLabel
} from "@/components/ui/select"
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, User, X, SlidersHorizontal
} from "lucide-react"

const CATEGORY_LABELS = {
  fiction: "Fiction",
  romance: "Romance",
  terror: "Horror",
  fantasy: "Fantasy",
  nonfiction: "Non-Fiction",
  biography: "Biography",
  technology: "Technology",
}

const ORDER_LABELS = {
  relevance: "Relevance",
  popular: "Most popular",
  rating: "Highest rated",
  newest: "Newest",
  az: "Title (A–Z)",
}

export function BookSearch({ filters, onFilterChange, onSearchSubmit }) {
  const activeChips = []
  if (filters.category) {
    activeChips.push({
      key: "category",
      label: CATEGORY_LABELS[filters.category] ?? filters.category,
    })
  }
  if (filters.author?.trim()) {
    activeChips.push({ key: "author", label: `Author: ${filters.author}` })
  }
  if (filters.orderBy && filters.orderBy !== "relevance") {
    activeChips.push({
      key: "orderBy",
      label: ORDER_LABELS[filters.orderBy] ?? filters.orderBy,
      resetTo: "relevance",
    })
  }

  const hasActiveFilters = activeChips.length > 0

  function clearChip(key, resetTo = "") {
    onFilterChange(key, resetTo)
  }

  function clearAll() {
    onFilterChange("category", "")
    onFilterChange("author", "")
    onFilterChange("orderBy", "relevance")
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") onSearchSubmit?.()
  }

  return (
    <div className="flex flex-col gap-3 my-4">

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title, author, or keyword..."
            className="pl-10 h-11 text-base"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          className="h-11 px-6 gap-2"
          onClick={() => onSearchSubmit?.()}
        >
          <Search className="h-4 w-4" />
          <span className="max-sm:hidden">Search</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="max-sm:hidden">Filters</span>
        </div>

        <Select
          value={filters.category}
          onValueChange={(v) => onFilterChange("category", v)}
        >
          <SelectTrigger className="w-34 h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="fiction">Fiction</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="terror">Horror</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="nonfiction">Non-Fiction</SelectItem>
              <SelectItem value="biography">Biography</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <Input
            placeholder="Author"
            className="pl-9 h-9 w-36"
            value={filters.author}
            onChange={(e) => onFilterChange("author", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Select
          value={filters.orderBy}
          onValueChange={(v) => onFilterChange("orderBy", v)}
        >
          <SelectTrigger className="w-34 h-9">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order by</SelectLabel>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="az">Title (A–Z)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground gap-1.5"
            onClick={clearAll}
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => clearChip(chip.key, chip.resetTo)}
              className="group flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full border border-border bg-card hover:bg-muted transition-colors text-xs"
            >
              <span>{chip.label}</span>
              <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export function BooksPagination({ pagination }) {
  const { page, perPage, totalPages, totalItems, setPage, setPerPage } = pagination

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 3) return [1, 2, 3, "...", totalPages]
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages]
    return [1, "...", page - 1, page, page + 1, "...", totalPages]
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="max-sm:hidden">Showing</span>
        <Select
          value={String(perPage)}
          onValueChange={(v) => setPerPage(Number(v))}
        >
          <SelectTrigger className="w-17.5 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>per page</span>
        {totalItems > 0 && (
          <span className="max-sm:hidden">- {totalItems.toLocaleString()} results</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline" size="icon"
          disabled={page === 1}
          onClick={() => setPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline" size="icon"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="md:px-2 text-muted-foreground">...</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="icon"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline" size="icon"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline" size="icon"
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
    </div>
  )
}