import { Button } from "@/components/ui/button"
import { BookX, MoveLeft } from "lucide-react"
import { Link } from "react-router"
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'

function NotFoundPage() {

  return (
    <div className='min-h-screen overflow-x-hidden'>
      <Header />

      <div className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6 mt-20">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#ff8400]/30">
          <BookX className="h-10 w-10 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-8">
          <h1 className="text-8xl font-bold text-muted-foreground/30 background ">404</h1>
          <h2 className="text-2xl font-semibold">Page not found</h2>
          <p className="text-muted-foreground max-w-sm -mt-4">
            Looks like this page got lost on the shelf. Let's get you back to your reading journey.
          </p>
        </div>

        <Link to="/">
        <Button className="gap-2">
            <MoveLeft className="h-4 w-4" />
            Back to Home
        </Button>
        </Link>
      </div>

      <Footer />
    </div>
  )
}

export default NotFoundPage