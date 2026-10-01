import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OpenRoutes from './components/OpenRoutes';
import MovieDetails from './components/movies/MovieDetails';
import BookingPage from './pages/BookingPage';
import SeatSelectionPage from './pages/SeatSelectionPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:name/:id" element={<MovieDetails />} />
          <Route path="/booking/:name/:id" element={<BookingPage />} />
          <Route path="/seat-select/:showId" element={<SeatSelectionPage />} />
          <Route path="/browse" element={<Movies />} />

          <Route element={<OpenRoutes />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
