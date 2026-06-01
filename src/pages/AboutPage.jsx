import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import AboutCard from '@/components/AboutCard.jsx'
import ShelfBg from '../assets/shelf.webp'
import {FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

function AboutPage() {
  return (
    <div className='overflow-x-hidden min-h-screen'>
      <Header />

      <div
        className="relative w-full  h-65 md:h-80  bg-cover bg-center"
        style={{ backgroundImage: `url(${ShelfBg})` }}
        >
            <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="relative px-6 md:px-14 lg:px-32 -mt-32 pb-16">


        <div className="relative max-w-3xl">
          <Badge variant="secondary" className="mb-6 text-xs tracking-widest uppercase">About the Project</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
            Built out of a <br/>
            <span className="italic">real frustration.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ever finished a book and completely forgotten you read it? 
            Smart Shelf gives you one place to keep track of everything — what you've read, what you're reading, and what's next.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-32 pb-24 flex flex-col gap-20">

        <Separator />

        <AboutCard/>

        <Separator />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-serif font-bold">The developer</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[url('https://avatars.githubusercontent.com/u/95515067')] bg-cover rounded-2xl hover:opacity-80 transition-all border border-border flex items-center justify-center text-2xl font-serif font-bold"/>
              <div>
                <p className="font-semibold text-lg">Pedro Parisi</p>
                <p className="text-sm text-muted-foreground">Computer Science student @ UFSCar</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Building Smart Shelf as a way to grow as a developer. Learning React, design systems,
              API integration, and what it actually takes to ship something that feels good to use.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="https://github.com/pedroparisii" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                   <FaGithub/>
                   GitHub
                </Button>
              </a>
              <a href="https://linkedin.com/in/pedroparisi" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                   <FaLinkedin/>
                   LinkedIn
                </Button>
              </a>
              <a href="https://instagram.com/pedroparisii" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                   <FaInstagram/>
                   Instagram
                </Button>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-8 rounded-2xl border border-border bg-card">
            <div className="text-3xl"><FaGithub /></div>
            <h3 className="text-xl font-serif font-bold">See it on GitHub</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart Shelf is open source. Browse the code, open an issue, or just leave a star if you like what you see.
            </p>
            <a href="https://github.com/pedroparisii/smart-shelf" target="_blank" rel="noreferrer">
              <Button className="gap-2 w-fit">
                <ExternalLink className="h-4 w-4" /> View on GitHub
              </Button>
            </a>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default AboutPage