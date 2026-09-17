import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, getShows } from '../../redux/slices/moviesSlice';

/* ─── helpers ────────────────────────────────────────────── */
function formatDuration(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
}

function getUniqueDates(theaters) {
  const set = new Set();
  theaters?.forEach(({ shows }) =>
    shows?.forEach(({ startTime }) => {
      if (startTime) set.add(startTime.slice(0, 10));
    })
  );
  return Array.from(set).sort();
}

function showsForDate(shows, dateStr) {
  return shows.filter((s) => s.startTime?.slice(0, 10) === dateStr);
}

/* ─── movie header ─────────────────────────────────────── */
function MovieHeader({ movie }) {
  if (!movie) return null;
  const { title, poster, censorRating, duration, language, genres = [], releaseDate } = movie;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div className="bg-white border-b border-gray-100 px-4 md:px-10 py-5 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-start gap-5">
        {/* poster */}
        <div className="shrink-0 w-20 h-28 rounded-lg overflow-hidden shadow-md bg-gray-100">
          {poster
            ? <img src={poster} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">img</div>
          }
        </div>

        {/* info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight m-0">{title}</h1>
            {year && <span className="text-sm font-normal text-gray-500">({year})</span>}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-600 flex-wrap">
            {censorRating && (
              <span className="px-1.5 py-0.5 border border-gray-300 text-gray-700 font-bold rounded">
                {censorRating}
              </span>
            )}
            {duration && (
              <>
                <span className="text-gray-400">|</span>
                <span className="font-medium">{formatDuration(duration)}</span>
              </>
            )}
          </div>

          {language && <p className="text-xs text-gray-600 font-medium">{language}</p>}
          {genres.length > 0 && <p className="text-xs text-gray-500">{genres.join(', ')}</p>}
        </div>
      </div>
    </div>
  );
}

/* ─── censor warning banner ────────────────────────────── */
function CensorBanner({ rating }) {
  if (rating !== 'A') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 mt-4 rounded-xl px-4 py-3 flex items-start gap-3 bg-yellow-50 border border-yellow-100">
      <span className="shrink-0 w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-xs font-extrabold text-white font-bold text-sm">
        A
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">Movie suitable for adults (18+ years) only</p>
        <p className="text-xs text-gray-600 mt-1">Please carry your IDs with birth date for verification</p>
      </div>
    </div>
  );
}

/* ─── date picker ──────────────────────────────────────── */
function DateStrip({ dates, selected, onSelect }) {
  if (!dates.length) return null;

  const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 mt-5">
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1 scrollbar-none">
        {/* month label */}
        {dates[0] && (
          <span className="shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 self-end pb-0.5">
            {MONTH[new Date(dates[0]).getMonth()]}
          </span>
        )}

        {dates.map((d) => {
          const dt = new Date(d);
          const day = dt.getDate();
          const dayName = DAY[dt.getDay()];
          const isActive = d === selected;

          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-center transition-all cursor-pointer border text-sm
                ${isActive
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
            >
              <span className="font-bold leading-none">{day}</span>
              <span className={`text-[9px] font-semibold mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                {dayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── availability legend ──────────────────────────────── */
function LegendBar() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 mt-4">
      <div className="flex items-center gap-6 py-3 px-4 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600 w-fit">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-900" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Filling fast
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Almost full
        </span>
      </div>
    </div>
  );
}

/* ─── show time button ─────────────────────────────────── */
function ShowTimeButton({ show, movieId, movieName }) {
  const navigate = useNavigate();
  const time = formatTime(show.startTime);

  const borderColor =
    show.status === 'almost_full' ? 'border-red-400' :
    show.status === 'filling_fast' ? 'border-yellow-400' :
    'border-gray-200 hover:border-gray-400';

  const textColor =
    show.status === 'almost_full' ? 'text-red-500' :
    show.status === 'filling_fast' ? 'text-yellow-600' :
    'text-gray-800';

  return (
    <button
      onClick={() => navigate(`/seat-select/${show._id}`)}
      className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition-all cursor-pointer min-w-[85px] text-center ${borderColor} ${textColor}`}
    >
      <span className="text-sm font-semibold">{time}</span>
      {show.screenName && (
        <span className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase">{show.screenName}</span>
      )}
    </button>
  );
}

/* ─── theater card ─────────────────────────────────────── */
function TheaterCard({ theaterData, selectedDate, movieId, movieName }) {
  const { theater, shows } = theaterData;
  const filtered = showsForDate(shows, selectedDate);

  if (!filtered.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
      {/* theater icon */}
      <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden text-xs font-extrabold text-gray-500">
        {theater.name?.substring(0, 2).toUpperCase()}
      </div>

      {/* theater info + shows */}
      <div className="flex-1 min-w-0">
        {/* name and heart */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 leading-tight">
              {theater.name}
              {theater.city && (
                <span className="font-semibold text-gray-600">, {theater.city}</span>
              )}
            </h3>
          </div>
          <button className="shrink-0 text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* show time buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          {filtered.map((show) => (
            <ShowTimeButton
              key={show._id}
              show={show}
              movieId={movieId}
              movieName={movieName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── main page ────────────────────────────────────────── */
export default function BookingPage() {
  const { name, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleMovie: movie, shows, loading } = useSelector((s) => s.movies);
  const { latitude, longitude } = useSelector((s) => s.location);

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!movie || movie._id !== id) {
      dispatch(fetchMovieById(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && latitude && longitude) {
      dispatch(getShows({ id, longitude, latitude }));
    }
  }, [id, latitude, longitude]);

  const theaters = shows?.result || [];
  const uniqueDates = getUniqueDates(theaters);

  useEffect(() => {
    if (uniqueDates.length && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [shows]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="h-8 w-8 animate-spin text-[#471b8e]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs text-gray-500">Finding shows near you…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* movie header (sticky) */}
      <MovieHeader movie={movie} />

      {/* censor banner */}
      {movie?.censorRating && (
        <div className="max-w-6xl mx-auto">
          <CensorBanner rating={movie.censorRating} />
        </div>
      )}

      {/* date strip */}
      <DateStrip
        dates={uniqueDates}
        selected={selectedDate}
        onSelect={setSelectedDate}
      />

      {/* legend */}
      <LegendBar />

      {/* theater list */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 mt-6 mb-10 space-y-3">
        {!theaters.length ? (
          <div className="py-16 text-center">
            <svg className="h-12 w-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
            </svg>
            <p className="text-gray-500 font-semibold text-sm">No shows available.</p>
            <p className="text-gray-400 text-xs mt-1">Try a different date or check back later.</p>
          </div>
        ) : (
          theaters.map((t, i) => (
            <TheaterCard
              key={t.theater._id || i}
              theaterData={t}
              selectedDate={selectedDate}
              movieId={id}
              movieName={name}
            />
          ))
        )}
      </div>

    </div>
  );
}
