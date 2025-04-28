import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ username: "user1" }); // mock login
    navigate("/dashboard");
  };

  return (
  <>
    <div className='bg-black fixed top-0 left-0 w-full h-screen'></div>
    <div className='fixed w-full px-4 py-24 z-50'>
    <div className='max-w-[450px] h-[600px] mx-auto bg-blue-800 text-white'>
    <div className='max-w-[320px] mx-auto py-16'>
        <h1>Sign Up Here</h1>
        <form className='w-full flex flex-col py-4'>
                <p className='text-white font-bold'>UserName</p>
                <input type="text" required className='p-3 my-2 rounded text-black' placeholder='JohnDoe'/>
                <p className='text-white font-bold'>PassWord</p>
                <input type="password" required className='p-3 my-2 rounded text-black' placeholder='Please enter a strong password'/>
            <button type="submit" className='bg-red-700 py-3 my-6 rounded font-bold px-4' onClick={handleLogin}>Login</button>
            <div>
                <p><input type="checkbox" />Remember Me</p>
            </div>
        </form>
    </div>
    </div>
    </div>
    </>
  )
}

export default Login