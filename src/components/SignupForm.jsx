import { useState } from 'react'
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Books from '../assets/books2.webp'
import { signUpWithEmail } from "@/lib/auth"
import { GENRES } from "@/lib/genres"
import { Loader2, ArrowLeft, Check, MailCheck } from 'lucide-react'

const formats = [
  { key: "physical",  label: "Physical",  icon: "📖" },
  { key: "digital",   label: "Digital",   icon: "📱" },
  { key: "audiobook", label: "Audiobook", icon: "🎧" },
]

function SignupForm() {
  const navigate = useNavigate()

  // Step 1
  const [email, setEmail]             = useState("")
  const [username, setUsername]       = useState("")
  const [password, setPassword]       = useState("")
  const [confirmPassword, setConfirm] = useState("")

  // Step 2
  const [selectedGenres, setSelectedGenres] = useState([])

  // Step 3
  const [readingGoal, setReadingGoal]     = useState(12)
  const [readingFormat, setReadingFormat] = useState(null)

  const [step, setStep]       = useState(1)   // 4 = "confirm your email"
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const toggleGenre = (key) => {
    setSelectedGenres(prev =>
      prev.includes(key) ? prev.filter(g => g !== key) : [...prev, key]
    )
  }

  function handleStep1() {
    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setError("Username is required.")
      return
    }
    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }
    if (trimmedUsername.length > 25) {
      setError("Username must be at most 25 characters.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError(null)
    setStep(2)
  }

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      const { session } = await signUpWithEmail({
        email,
        password,
        username: username.trim(),
        genres: selectedGenres,
        readingGoal,
        readingFormat,
      })
      // No session means the project requires email confirmation first
      if (session) navigate('/shelf')
      else setStep(4)
    } catch (err) {
      setError(err.message)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">

          {step === 1 && (
            <form className="p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); handleStep1() }}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    Enter your email below to create your account
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email" type="email" placeholder="m@example.com" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                  <FieldDescription>
                    We'll use this to contact you. We will not share your email with anyone else.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username" type="text" placeholder="Enter your username" required
                    value={username} maxLength={25} onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>

                <Field>
                  <Field className="grid grid-cols-2 gap-4">
                    <Field className="relative">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password" type="password" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                      <Input
                        id="confirm-password" type="password" required
                        value={confirmPassword} onChange={(e) => setConfirm(e.target.value)}
                      />
                    </Field>
                  </Field>
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>

                <Field>
                  <Button type="submit" className="w-full">Continue</Button>
                </Field>

                <Separator />

                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Log in</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}

          {step === 2 && (
            <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-150">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <div className="flex gap-1">
                    <div className="w-8 h-1 rounded-full bg-muted-foreground" />
                    <div className="w-8 h-1 rounded-full bg-primary" />
                    <div className="w-8 h-1 rounded-full bg-muted-foreground" />
                  </div>
                  Step 2 of 3
                </div>
                <h1 className="text-2xl font-bold">Your reading taste</h1>
                <p className="text-sm text-muted-foreground">Help us personalize your Smart Shelf experience.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Favorite genres <span className="text-muted-foreground font-normal">(pick as many as you like)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GENRES.map(({ key, label, icon: Icon, color }) => {
                    const selected = selectedGenres.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleGenre(key)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left
                          ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"}`}
                      >
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className={selected ? "font-medium" : "text-muted-foreground"}>{label}</span>
                        {selected && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" type="button" className="gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button type="button" className="flex-1" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-150">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <div className="flex gap-1">
                    <div className="w-8 h-1 rounded-full bg-muted-foreground" />
                    <div className="w-8 h-1 rounded-full bg-muted-foreground" />
                    <div className="w-8 h-1 rounded-full bg-primary" />
                  </div>
                  Step 3 of 3
                </div>
                <h1 className="text-2xl font-bold">Your reading goals</h1>
                <p className="text-sm text-muted-foreground">Set your reading goals and preferred format.</p>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                  Annual reading goal
                  <span className="ml-2 text-primary font-semibold">{readingGoal} books</span>
                </label>
                <input
                  type="range" min={1} max={60}
                  value={readingGoal}
                  onChange={(e) => setReadingGoal(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 book</span>
                  <span>60 books</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Preferred format</label>
                <div className="grid grid-cols-3 gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setReadingFormat(f.key)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-sm transition-all
                        ${readingFormat === f.key ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"}`}
                    >
                      <span className="text-2xl">{f.icon}</span>
                      <span className={readingFormat === f.key ? "font-medium text-xs" : "text-muted-foreground text-xs"}>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" type="button" className="gap-2" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
                    : "Create my shelf"
                  }
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-3 text-center">
              <MailCheck className="h-10 w-10 text-primary" />
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
                Click it to activate your shelf.
              </p>
            </div>
          )}

          <div className="relative hidden bg-muted md:block">
            <img
              src={Books} alt=""
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupForm