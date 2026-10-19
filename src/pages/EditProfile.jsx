import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import PageLoader from '@/components/PageLoader.jsx'
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
import { getInitials } from '@/lib/utils'

function EditProfile() {
  const { profile, loading, updateProfile } = useProfile()
  if (loading) return <PageLoader />
  return <ProfileForm profile={profile ?? {}} updateProfile={updateProfile} />
}

function ProfileForm({ profile, updateProfile }) {
  const navigate = useNavigate()

  const [displayName, setDisplayName]         = useState(profile.display_name ?? '')
  const [bio, setBio]                         = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl]             = useState(profile.avatar_url ?? '')
  const [preferredFormat, setPreferredFormat] = useState(profile.preferred_format ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await updateProfile({
        display_name: displayName.trim() || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        preferred_format: preferredFormat || null,
      })
      toast.success("Profile saved!")
      navigate('/shelf')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 py-12 mt-20 max-w-2xl mx-auto flex flex-col gap-6">

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate('/shelf')}>
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
                maxLength={25}
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
  )
}

export default EditProfile