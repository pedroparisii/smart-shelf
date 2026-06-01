import { Separator } from "@/components/ui/separator"
import { BookOpen,  Heart } from "lucide-react"
import { FaGithub, FaTwitter } from "react-icons/fa"
import Logo from "../assets/logo.png"
import { Link } from "react-router"

function Footer() {

  const links = {
    Discover: [
      { label: "Search Books", to: "/search" },
      { label: "Most Popular", to: "/search?orderBy=popular" },
      { label: "New Releases", to: "/search?orderBy=newest" },
    ],
    Account: [
      { label: "Sign Up", to: "/signup" },
      { label: "Login", to: "/login" },
      { label: "My Shelf", to: "/shelf" },
    ],
    Project: [
      { label: "About", to: "/about" },
      { label: "News", to: "/news" },
      { label: "Github", to: "https://github.com/pedroparisii/smart-shelf", external: true },
    ],
  }


  return (
    <footer className="bg-card border-t border-border ">
      <div className="max-w-6xl mx-auto px-8 py-12">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="flex flex-col gap-3">
            <img src={Logo} alt="Logo" className="w-42" draggable="false" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal library, reimagined. Discover, organize and track your reading journey.
            </p>
            <div className="flex gap-3 mt-2 items-center">
              <a href="https://github.com/pedroparisii/smart-shelf" target="_blank" rel="noreferrer">
                <FaGithub className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <p className="text-sm text-muted-foreground">Github</p>
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-3 max-sm:items-center max-sm:text-center">
              <h4 className="text-sm font-semibold">{section}</h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                    <li key={item.label}>
                      {item.external ? (
                        <a href={item.to} target="_blank" rel="noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {item.label}
                        </a>
                      ) : (
                        <Link to={item.to}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 text-xs text-muted-foreground select-none">
          <span>© {new Date().getFullYear()} Smart Shelf. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-rose-400 mx-0.5" /> for book lovers
          </span>
        </div>

      </div>
    </footer>
  )
}

export default Footer