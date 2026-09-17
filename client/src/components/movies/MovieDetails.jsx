import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, getShows } from '../../../redux/slices/moviesSlice';

/* ── tiny helpers ─────────────────────────────────────── */
function formatDuration(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* ── skeleton loader ──────────────────────────────────── */
function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />
  );
}

/* ── star rating display ──────────────────────────────── */
function StarRating({ score, outOf = 5 }) {
  const pct = Math.round((score / outOf) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-3.5 w-3.5 ${s <= pct ? 'text-[#ff9740]' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function MovieDetails() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleMovie: movie, loading } = useSelector((s) => s.movies);
  const { longitude, latitude } = useSelector((state) => state.location);

  useEffect(() => {
    dispatch(fetchMovieById(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleTicketBook = () => {
    if (latitude && longitude) {
      navigate(`/booking/${name}/${id}`);
    }
  };
  /* ── loading state ──────────────────────────────────── */
  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-[#0d0520]">
        {/* hero skeleton */}
        <div className="relative h-[520px] bg-[#0d0520] px-6 md:px-16 flex items-end pb-14 gap-8">
          <Skeleton className="w-44 h-64 shrink-0" />
          <div className="flex-1 space-y-4 pb-2">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full max-w-lg" />
            <Skeleton className="h-4 w-3/4 max-w-md" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
        {/* body skeleton */}
        <div className="bg-white px-6 md:px-16 py-12 space-y-8">
          <Skeleton className="h-6 w-32 bg-[#e5e0f2]" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-16 w-16 rounded-full bg-[#e5e0f2]" />
                <Skeleton className="h-3 w-16 bg-[#e5e0f2]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── data ────────────────────────────────────────────── */
  const {
    title,
    poster,
    duration,
    description,
    genres = [],
    censorRating,
    releaseDate,
    language,
    cast = [],
    crew = [],
    trailerUrl,
    ratings = [],
  } = movie;

  const allCrew = [...cast, ...crew];

  /* ── mock ratings if none in DB yet ────────────────── */
  const displayRatings =
    ratings.length > 0
      ? ratings
      : [
          { source: 'IMDb', score: 7.4, outOf: 10 },
          { source: 'Rotten Tomatoes', score: 82, outOf: 100 },
        ];

  return (
    <div className="min-h-screen bg-white">
      {/* ════════════════════════════════════════════════
          HERO — dark cinematic section
      ════════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0520] overflow-hidden">
        {/* blurred poster backdrop */}
        {poster && (
          <div
            className="absolute inset-0 bg-center bg-cover opacity-20 scale-105"
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}

        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0520] via-[#0d0520]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0520] via-transparent to-transparent" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#471b8e]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#ff9740]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 py-14 flex flex-col md:flex-row gap-10 items-start">

          {/* ── LEFT: movie info ────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Link to="/movies" className="hover:text-white/70 transition-colors decoration-none">Movies</Link>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white/60 truncate max-w-xs">{title}</span>
            </div>

            {/* title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none m-0">
              {title}
            </h1>

            {/* meta pills */}
            <div className="flex items-center flex-wrap gap-2">
              {censorRating && (
                <span className="px-2.5 py-0.5 rounded border border-white/30 text-white/80 text-xs font-bold tracking-wide">
                  {censorRating}
                </span>
              )}
              {language && (
                <span className="text-white/70 text-sm font-medium">{language}</span>
              )}
              {language && duration && <span className="text-white/30">|</span>}
              {duration && (
                <span className="text-white/70 text-sm font-medium">{formatDuration(duration)}</span>
              )}
            </div>

            {/* description */}
            {description && (
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                {description}
              </p>
            )}

            {/* genre tags */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* release date */}
            {releaseDate && (
              <p className="text-white/50 text-xs font-medium">
                Released {formatDate(releaseDate)}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center gap-3 pt-1">
              <button onClick={handleTicketBook} className="h-11 px-8 rounded-xl text-xs font-extrabold uppercase tracking-widest text-white bg-gradient-to-r from-[#230d56] via-[#351371] to-[#471b8e] hover:from-[#351371] hover:to-[#471b8e] shadow-lg shadow-[#471b8e]/30 transition-all duration-300 active:scale-[0.97] cursor-pointer">
                Book Tickets
              </button>
              {trailerUrl && (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/80 border border-white/20 hover:bg-white/10 transition-all duration-200 flex items-center gap-2 decoration-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Trailer
                </a>
              )}
            </div>
          </div>

          {/* ── RIGHT: poster card ──────────────────────── */}
          <div className="shrink-0 w-44 md:w-52 self-start">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10 group">
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  className="w-full aspect-[2/3] object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-white/10 flex items-center justify-center">
                  <svg className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}

              {/* trailer play overlay */}
              {trailerUrl && (
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300 decoration-none"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg className="h-5 w-5 text-[#230d56] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BODY — light section
      ════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-12 space-y-14">

        {/* ── Cast & Crew ─────────────────────────────── */}
        {allCrew.length > 0 && (
          <section>
            <h2 className="text-lg font-extrabold text-[#230d56] mb-6 tracking-tight">
              Cast &amp; Crew
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-none">
              {allCrew.map((person, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-20 text-center">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-[#f2eefa] ring-2 ring-[#e5e0f2]">
                    {person.photo ? (
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#471b8e]/20 to-[#ff9740]/20">
                        <span className="text-lg font-bold text-[#471b8e]">
                          {person.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#230d56] leading-tight">{person.name}</p>
                    {person.role && (
                      <p className="text-[10px] text-[#4a3e56]/50 leading-tight">{person.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── placeholder cast when no data ──────────── */}
        {allCrew.length === 0 && (
          <section>
            <h2 className="text-lg font-extrabold text-[#230d56] mb-6 tracking-tight">
              Cast &amp; Crew
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {['Lead Actor', 'Supporting', 'Director', 'Producer'].map((role) => (
                <div key={role} className="flex flex-col items-center gap-2 shrink-0 w-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#471b8e]/10 to-[#ff9740]/10 ring-2 ring-[#e5e0f2] flex items-center justify-center">
                    <svg className="h-7 w-7 text-[#471b8e]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-[#4a3e56]/40 leading-tight">{role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* divider */}
        <div className="border-t border-[#e5e0f2]" />

        {/* ── Ratings & Reviews ───────────────────────── */}
        <section>
          <h2 className="text-lg font-extrabold text-[#230d56] mb-6 tracking-tight">
            Ratings &amp; Reviews
          </h2>

          <div className="space-y-4">
            {displayRatings.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#e5e0f2] bg-[#fafaf9]"
              >
                {/* source badge */}
                <div className="shrink-0 h-9 w-9 rounded-lg bg-[#471b8e]/10 flex items-center justify-center">
                  <span className="text-[9px] font-extrabold text-[#471b8e] leading-none text-center px-0.5">
                    {r.source?.substring(0, 4).toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#230d56] leading-none">
                      {r.score}
                    </span>
                    <span className="text-xs text-[#4a3e56]/40 font-medium">/ {r.outOf}</span>
                  </div>
                  <StarRating score={r.score} outOf={r.outOf} />
                </div>

                <span className="ml-auto text-xs font-semibold text-[#4a3e56]/60">{r.source}</span>
              </div>
            ))}

            {/* no ratings placeholder */}
            {displayRatings.length === 0 && (
              <div className="py-10 text-center text-[#4a3e56]/40 text-sm">
                No ratings available yet.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
