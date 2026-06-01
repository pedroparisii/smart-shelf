import Header from '@/components/Header.jsx'
import LoginForm from '@/components/LoginForm.jsx'
import Footer from '@/components/Footer.jsx'

function Login() {

  return (
    <div className='overflow-x-hidden'>
      <Header />

      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
            <LoginForm />
        </div>
      </div>

      <Footer />
      
    </div>
  )
}

export default Login