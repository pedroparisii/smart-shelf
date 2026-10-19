import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import PageLoader from '@/components/PageLoader.jsx'
import { useAuth } from '@/hooks/useAuth'
import { updatePassword } from '@/lib/auth'

// Landing page of the reset email link — Supabase signs the user in from it
function ResetPassword() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setError(null)
    setLoading(true)
    try {
      await updatePassword(password)
      toast.success('Password updated!')
      navigate('/shelf')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (authLoading) return <PageLoader />

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-sm">
        <CardContent>
          {user ? (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <h1 className="text-2xl font-bold text-center">Choose a new password</h1>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Field>
                  <FieldLabel htmlFor="password">New password</FieldLabel>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Update password
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              This reset link is invalid or has expired. <Link to="/login" className="underline">Back to login</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
