import React, {useEffect} from 'react'
import Login from '../components/Authentication/Login'
import {useNavigate} from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate() // Usenavigate to redirect to the page

  useEffect(() => {
        sessionStorage.clear()
        window.location.reload(false);
        navigate('/')
      }, [navigate]);
  return (
    <Login/>
  )
}

export default LogoutPage