import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoutes from './components/ProtectedRoutes';
import OpenRoutes from './components/OpenRoutes';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/browse" />

          <Route element={<OpenRoutes />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

