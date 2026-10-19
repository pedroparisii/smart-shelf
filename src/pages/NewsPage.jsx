import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import NewsBg from '../assets/news.webp'
import { ArticleByline, ArticleTags } from '@/components/ArticleMeta.jsx'
import { ARTICLES } from '@/lib/articles'

const excerpt = (article) => article.body.split('\n\n')[0]

function NewsPage() {
  const [featured, ...rest] = ARTICLES

  return (
    <>
      <div
        className="relative w-full h-72 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${NewsBg})` }}
      >
        <div className="absolute inset-0 backdrop-blur-[2px] bg-background/60" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Smart Shelf</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">Reading Room</h1>
          <p className="text-muted-foreground mt-3 text-sm tracking-wide">Curiosities, opinions & stories from the world of books</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-24 flex flex-col gap-12">

        {/* Featured */}
        <Link
          to={`/news/${featured.slug}`}
          className="group grid md:grid-cols-5 gap-8 p-8 md:p-12 rounded-2xl border border-border bg-card hover:border-contrast/60 transition-colors"
        >
          <div className="md:col-span-3 flex flex-col gap-4">
            <ArticleTags article={featured} />
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight group-hover:text-contrast transition-colors">
              {featured.title}
            </h2>
            <p className="text-lg text-muted-foreground italic">{featured.subtitle}</p>
            <div className="mt-auto pt-4"><ArticleByline article={featured} /></div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4 md:border-l md:border-border md:pl-8">
            <p className="font-serif text-lg leading-relaxed text-foreground/80 line-clamp-6">{excerpt(featured)}</p>
            <span className="text-sm font-medium flex items-center gap-1.5 text-contrast mt-auto">
              Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Latest */}
        <div className="flex flex-col gap-6">
          <h2 className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground">Latest</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                to={`/news/${article.slug}`}
                className="group flex flex-col gap-3 p-6 rounded-xl border border-border bg-card hover:border-contrast/60 transition-colors"
              >
                <ArticleTags article={article} />
                <h3 className="text-xl font-serif font-bold leading-snug group-hover:text-contrast transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{excerpt(article)}</p>
                <div className="flex items-center justify-between pt-3 mt-auto text-xs text-muted-foreground">
                  <span>{article.date}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-contrast" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default NewsPage
