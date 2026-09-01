import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom';
function ProtectedRoutes() {
    const isAuthenticated = Cookies.get('isAuthenticated') ;

    if(!isAuthenticated){
      return  <Navigate to="/login"/>
    }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ProtectedRoutes
