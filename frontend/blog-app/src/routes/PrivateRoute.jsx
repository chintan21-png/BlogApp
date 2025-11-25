import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({allowedRoles}) => {
 const { user, loading } = useContext(UserContext);


  if(loading) {
    return <div>Loading...</div>;
  }

  if(!user) {
    return <Navigate to="/" replace />;
  }
  if(!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
 
}

export default PrivateRoute