import { useState } from 'react'
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field, FieldDescription, FieldGroup,
  FieldLabel, FieldSeparator,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Books from '../assets/books2.png'
import { signUpWithEmail } from "@/hooks/useAuth"
import { Loader2, ArrowLeft, Check, Rocket, Heart, Skull, Wand2, Search, UserRound, Cpu, Landmark, Sparkles, Brain, Compass, Feather } from 'lucide-react'

const genres = [
  { key: "sci-fi",      label: "Science Fiction", icon: <Rocket    className="h-4 w-4" />, color: "text-blue-400"   },
  { key: "romance",     label: "Romance",          icon: <Heart     className="h-4 w-4" />, color: "text-pink-400"   },
  { key: "horror",      label: "Horror",           icon: <Skull     className="h-4 w-4" />, color: "text-red-400"    },
  { key: "fantasy",     label: "Fantasy",          icon: <Wand2     className="h-4 w-4" />, color: "text-purple-400" },
  { key: "mystery",     label: "Mystery",          icon: <Search    className="h-4 w-4" />, color: "text-yellow-400" },
  { key: "biography",   label: "Biography",        icon: <UserRound className="h-4 w-4" />, color: "text-orange-400" },
  { key: "technology",  label: "Technology",       icon: <Cpu       className="h-4 w-4" />, color: "text-cyan-400"   },
  { key: "history",     label: "History",          icon: <Landmark  className="h-4 w-4" />, color: "text-amber-400"  },
  { key: "self-help",   label: "Self-help",        icon: <Sparkles  className="h-4 w-4" />, color: "text-green-400"  },
  { key: "philosophy",  label: "Philosophy",       icon: <Brain     className="h-4 w-4" />, color: "text-indigo-400" },
  { key: "adventure",   label: "Adventure",        icon: <Compass   className="h-4 w-4" />, color: "text-teal-400"   },
  { key: "poetry",      label: "Poetry",           icon: <Feather   className="h-4 w-4" />, color: "text-rose-400"   },
]

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

  const [step, setStep]       = useState(1)
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
      await signUpWithEmail({
        email,
        password,
        username: username.trim(),
        genres: selectedGenres,
        readingGoal,
        readingFormat,
      })
      navigate('/shelf')
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
                  Already have an account? <a href="/login">Log in</a>
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
                  {genres.map((genre) => {
                    const selected = selectedGenres.includes(genre.key)
                    return (
                      <button
                        key={genre.key}
                        type="button"
                        onClick={() => toggleGenre(genre.key)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left
                          ${selected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"}`}
                      >
                        <span className={genre.color}>{genre.icon}</span>
                        <span className={selected ? "font-medium" : "text-muted-foreground"}>{genre.label}</span>
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

          <div className="relative hidden bg-muted md:block">
            <img
              src={Books} alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default SignupForm