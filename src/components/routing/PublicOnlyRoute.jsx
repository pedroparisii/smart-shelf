import { Navigate } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  if (user) return <Navigate to="/shelf" replace />

  return children
}

export default PublicOnlyRoute