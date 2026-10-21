import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
function CustomerLayout() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

//   if (isAuthenticated && role && role !== 'customer') {
//     <Navigate to="/login" />;
//   }
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default CustomerLayout;
