import SignupForm from '@/components/SignupForm.jsx'

function Signup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
          <SignupForm />
      </div>
    </div>
  )
}

export default Signup
