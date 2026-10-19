import { Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AUTHOR, CATEGORY_STYLES } from '@/lib/articles'

export function ArticleTags({ article }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className={`font-medium px-2.5 py-1 rounded-full ${CATEGORY_STYLES[article.category]}`}>
        {article.category}
      </span>
      <span className="text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" /> {article.readTime}
      </span>
    </div>
  )
}

export function ArticleByline({ article }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={AUTHOR.avatar} alt="" />
        <AvatarFallback>PP</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-medium">{AUTHOR.name}</span>
        <span className="text-muted-foreground text-xs">{article.date}</span>
      </div>
    </div>
  )
}
