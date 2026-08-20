import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar />}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  )
}

export default App