import React, {useEffect, useState, useContext} from 'react'
import { AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { AiOutlineTwitter } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const [loginForm, setLoginForm] = useState(true);
  const navigate = useNavigate();

  const handleRegister = () =>{
    setLoginForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // await login(email, password);
  //     navigate("/");
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}>
    
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
    <div className="md:w-1/3 max-w-sm">
      <img
        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
        alt="Sample image"
      />
    </div>

    {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}
    <div className="md:w-1/3 max-w-sm">
      <div className="text-center md:text-left">
        <label className="mr-1">Sign in with</label>
        <button
          type="button"
          className="mx-1 h-9 w-9  rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
        >
          <BiLogoFacebook
            size={20}
            className="flex justify-center items-center w-full"
          />
        </button>
        <button
          type="button"
          className="inlne-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
        >
          <AiOutlineTwitter
            size={20}
            className="flex justify-center items-center w-full"
          />
        </button>
      </div>
      <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
        <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
          Or
        </p>
      </div>
      <input
        className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
        type="text"
        placeholder="Email Address"
        value={email}
        disabled={loading}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
        type="password"
        placeholder="Password"
        disabled={loading}
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mt-4 flex justify-between font-semibold text-sm">
        <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
          <input className="mr-1" type="checkbox" />
          <span>Remember Me</span>
        </label>
        <a
          className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
          href="#"
        >
          Forgot Password?
        </a>
      </div>
      <div className="text-center md:text-left">
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider" 
          onClick={handleSubmit}
          disabled={loading}
        >
          Login
        </button>
      </div>
      <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
        Don&apos;t have an account?{" "}
        {/* <a
          className="text-red-600 hover:underline hover:underline-offset-4"
        > */}
        <Link className="text-red-600 hover:underline hover:underline-offset-4" to="/registration">Register</Link>
        {/* </a> */}
      </div>
    </div>
  </section>

  </motion.div>
  );
}

export default Login