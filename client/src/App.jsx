import React from 'react'
import { Routes, Route,  } from 'react-router-dom'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
   
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    <footer/>
    </div>
  )
}

export default App