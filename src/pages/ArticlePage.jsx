import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ArticleByline, ArticleTags } from '@/components/ArticleMeta.jsx'
import { ARTICLES, articleBySlug } from '@/lib/articles'

const DROP_CAP = "first-letter:float-left first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:mr-3 first-letter:mt-1 first-letter:text-contrast"

function ArticlePage() {
  const { slug } = useParams()
  const article = articleBySlug(slug)
  if (!article) return <Navigate to="/news" replace />

  const more = ARTICLES.filter((a) => a.slug !== slug)

  return (
    <article className="max-w-2xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-8">
      <Link to="/news" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit">
        <ArrowLeft className="h-4 w-4" /> Reading Room
      </Link>

      <header className="flex flex-col gap-5">
        <ArticleTags article={article} />
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{article.title}</h1>
        <p className="text-xl text-muted-foreground italic font-serif">{article.subtitle}</p>
        <ArticleByline article={article} />
      </header>

      <Separator />

      <div className="flex flex-col gap-6 font-serif text-lg leading-8 text-foreground/90">
        {article.body.split('\n\n').map((p, i) => (
          <p key={i} className={i === 0 ? DROP_CAP : undefined}>{p}</p>
        ))}
      </div>

      <Separator className="mt-8" />

      <footer className="flex flex-col gap-4">
        <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">More from the Reading Room</h2>
        {more.map((a) => (
          <Link key={a.slug} to={`/news/${a.slug}`} className="group flex flex-col gap-1 py-2">
            <span className="font-serif text-lg font-semibold group-hover:text-contrast transition-colors">{a.title}</span>
            <span className="text-sm text-muted-foreground">{a.category} · {a.readTime}</span>
          </Link>
        ))}
      </footer>
    </article>
  )
}

export default ArticlePage
