import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import BookSearchSection from '@/components/BookSearchSection.jsx'

function SearchPage() {
  
  return (
    <div className='overflow-x-hidden'>
      <Header />

      <div className="min-h-screen bg-muted p-6 md:px-30 mt-20">
        <BookSearchSection />
      </div>

      <Footer />
      
    </div>
  )
}

export default SearchPage
