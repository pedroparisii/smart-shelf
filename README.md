<div align="center">
  <img src="https://i.ibb.co/V0pF2hdd/smart-shelf.png" alt="Smart Shelf" width="220" />
  <h3>Your personal library, reimagined.</h3>
  <p>Discover, organize, and track your reading journey.</p>
  <a href="https://smart-shelf-zeta.vercel.app/" target="_blank">Live Preview</a> ·
  <a href="https://github.com/pedroparisii/smart-shelf" target="_blank">GitHub</a>
</div>

---

## About

Smart Shelf is a full-stack book tracking web app inspired by Goodreads.

Built to practice real-world frontend architecture, backend integration, API consumption, and authenticated user data — going beyond typical portfolio projects that only touch the UI layer.

> [!NOTE]
> Book data is sourced from the [Open Library API](https://openlibrary.org/developers/api), a free and open catalog maintained by the Internet Archive.

## Features

- 🔍 **Book Search** — real-time search with URL params, shareable links, and server-side sorting
- 📚 **Personal Shelf** — save books with Reading / Saved / Read status
- 📝 **Notes** — write and persist notes per book
- 📊 **Reading Stats** — track your annual goal and reading progress
- 🏆 **Achievements** — unlock badges based on your real reading activity
- 🔐 **Authentication** — email/password signup with multi-step onboarding
- 🌙 **Dark / Light mode** — persisted across sessions

## Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

## Tools

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Architecture

The project follows a clean separation of concerns across three layers:

- **`src/lib/`** — API clients and database queries (`openLibrary.js`, `userBooks.js`, `supabase.js`)
- **`src/hooks/`** — all state logic (`useBookSearch`, `useAuth`, `useProfile`, `useUserBook`)
- **`src/pages/`** + **`src/components/`** — UI only, no business logic

Search results are cached in memory to minimize API calls. Book data is cached in Supabase to avoid repeated external requests when users load their shelf.

## Development Notes

First full-stack project published and I learned a lot from it.

Supabase was chosen over a custom Node/Express backend to focus on product quality and data architecture rather than infrastructure. Row Level Security policies ensure users can only access their own data.

AI was used throughout as a pair programming tool, for architecture decisions, debugging, and code review. All product decisions, design, and final implementation were made independently.

## Challenges

Debugging Supabase RLS policies, queries were returning 403 even with correct auth tokens. Root cause was missing `GRANT` permissions on the `authenticated` role, which is separate from RLS policies. Postgres requires both layers to be explicitly configured.

Migrated book data source mid-project from Google Books API to Open Library after discovering Google's API returned too many low-quality results (legal documents, academic papers) with no reliable popularity signal. Open Library's `readinglog_count` and native sort parameters solved both problems.