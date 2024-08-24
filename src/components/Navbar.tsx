import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

function Navbar() {
  return (
    <nav className="w-full py-4 dark:border-neutral-800 shadow-sm border dark:border-b-white/20 px-6">
      <div className="flex items-center justify-between">
        <div className="group flex items-center space-x-2 font-medium tracking-[-0.10em] transition-opacity duration-75">
          <Link
            href="/"
            className="select-none text-4xl text-transparent bg-clip-text bg-gradient-to-r font-extrabold from-cyan-400 to-lime-400 dark:from-purple-400 dark:to-pink-400"
          >
            palette
          </Link>
        </div>
        <ul className="space-x-2 flex">
          <li>
            <a
              href="https://github.com/Andresuito/palette"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon" className="group">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem] group-hover:scale-105 group-hover:rotate-12 duration-200" />
              </Button>
            </a>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
