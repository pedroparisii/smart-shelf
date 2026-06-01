import Header from '@/components/Header.jsx'
import SignupForm from '@/components/SignupForm.jsx'
import Footer from '@/components/Footer.jsx'

function Signup() {
  
  return (
    <div className='min-h-screen overflow-x-hidden'>
      <Header />

      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
            <SignupForm />
        </div>
      </div>

      <Footer />
      
    </div>
  )
}

export default Signup