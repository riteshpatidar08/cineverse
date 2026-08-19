import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full glass border-x-0 border-b-0 border-t border-white/10 dark:border-white/5 py-8 px-4 md:px-8 mt-auto flex flex-col gap-6">
      
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-1 ring-primary/30">
              <AvatarImage src="/logo.jpg" alt="cineVerse logo" className="object-cover" />
              <AvatarFallback className="font-bold bg-primary/20 text-primary text-xs">CV</AvatarFallback>
            </Avatar>
            <span className="text-base font-bold tracking-wider text-text-h">
              cineVerse
            </span>
          </div>
          <p className="text-xs text-text/60 leading-relaxed max-w-xs">
            Discover and explore a infinite universe of movies, TV shows, and entertainment databases.
          </p>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-h/60 block">Explore</span>
          <Link to="/movies" className="text-xs text-text/75 hover:text-text-h decoration-none">Movies Database</Link>
          <Link to="/tv" className="text-xs text-text/75 hover:text-text-h decoration-none">TV Shows</Link>
          <Link to="/browse" className="text-xs text-text/75 hover:text-text-h decoration-none">Advanced Search</Link>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-h/60 block">Legal</span>
          <Link to="/terms" className="text-xs text-text/75 hover:text-text-h decoration-none">Terms of Service</Link>
          <Link to="/privacy" className="text-xs text-text/75 hover:text-text-h decoration-none">Privacy Policy</Link>
          <Link to="/cookies" className="text-xs text-text/75 hover:text-text-h decoration-none">Cookie Settings</Link>
        </div>

        {/* Connect Links */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-h/60 block">Connect</span>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-xs text-text/75 hover:text-text-h decoration-none">Twitter / X</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs text-text/75 hover:text-text-h decoration-none">GitHub</a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-xs text-text/75 hover:text-text-h decoration-none">Discord Server</a>
        </div>

      </div>

      <div className="max-w-6xl w-full mx-auto border-t border-white/5 pt-4 flex justify-between items-center text-[11px] text-text/50">
        <span>© {currentYear} cineVerse. All rights reserved.</span>
        <span>Beta v1.0.0</span>
      </div>

    </footer>
  );
}
