import React from 'react';
import { Dialog, DialogContent } from '../ui/Dialog';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export default function MovieBookingModal({ movie, isOpen, onClose }) {
  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl glass rounded-3xl border border-white/20 p-0 overflow-hidden">
        {/* Modal Hero Header */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover filter blur-sm scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />

          <div className="absolute bottom-4 left-6 flex items-end gap-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 aspect-[2/3] rounded-xl object-cover border border-white/20 shadow-xl"
            />
            <div>
              <h2 className="text-xl font-bold text-text-h m-0 line-clamp-1">{movie.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary">{movie.censorRating || 'U'}</Badge>
                <span className="text-xs text-text/70">{movie.duration || 120} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text/60 mb-1">Genres & Languages</h4>
            <p className="text-sm text-text-h font-medium">
              {movie.genres?.join(', ') || 'Drama'} • {(movie.languages || ['Hindi']).join(', ')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text/60 mb-1">Synopsis</h4>
            <p className="text-xs md:text-sm text-text/80 leading-relaxed">
              {movie.description || 'Join us for an unforgettable cinematic experience on the big screen.'}
            </p>
          </div>

          {/* Showtime Selection Demo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text/60 mb-2">Available Showtimes</h4>
            <div className="flex flex-wrap gap-2">
              {['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM', '11:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => alert(`Selected showtime: ${time} for ${movie.title}`)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold glass border border-white/20 hover:border-primary hover:bg-primary/10 text-text-h transition-all cursor-pointer"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button variant="ghost" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert(`Redirecting to seat selection for ${movie.title}...`);
                onClose(false);
              }}
            >
              Proceed to Seats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
