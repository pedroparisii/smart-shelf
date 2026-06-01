import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

function getInitials(name) {
  if (!name) return '??'
  return name.trim().slice(0, 2).toUpperCase()
}

function EditProfile() {
  const navigate = useNavigate()
  const { profile, loading, updateProfile } = useProfile()

  const [displayName, setDisplayName]     = useState('')
  const [bio, setBio]                     = useState('')
  const [avatarUrl, setAvatarUrl]         = useState('')
  const [preferredFormat, setPreferredFormat] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '')
      setBio(profile.bio ?? '')
      setAvatarUrl(profile.avatar_url ?? '')
      setPreferredFormat(profile.preferred_format ?? '')
    }
  }, [profile])

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      await updateProfile({
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        preferred_format: preferredFormat || null,
      })
      setSuccess(true)
      setTimeout(() => navigate('/shelf'), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="overflow-x-hidden min-h-screen">
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden min-h-screen">
      <Header />

      <div className="px-6 md:px-16 lg:px-24 py-12 mt-20 max-w-2xl mx-auto flex flex-col gap-6">

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/shelf')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="flex flex-col gap-6">

              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 text-xl">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Profile picture</p>
                  <p className="text-xs text-muted-foreground">Paste a URL to an image</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="display-name">Username</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder="Your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself and your reading taste…"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="format">Preferred format</Label>
                <Select value={preferredFormat} onValueChange={setPreferredFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Pick a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">📖 Physical</SelectItem>
                    <SelectItem value="digital">📱 Digital</SelectItem>
                    <SelectItem value="audiobook">🎧 Audiobook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-500">Profile saved! Redirecting…</p>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/shelf')} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…</>
                    : <><Save className="h-4 w-4 mr-2" /> Save changes</>
                  }
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>

      <Footer />
    </div>
  )
}

export default EditProfile