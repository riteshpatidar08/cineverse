import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom';
function OpenRoutes() {
    const isAuthenticated = Cookies.get('isAuthenticated') ;

    if(isAuthenticated){
      return  <Navigate to="/"/>
    }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default OpenRoutes
