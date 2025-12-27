import React, {useState} from 'react'
import {motion} from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios'



const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [registered, setRegistered] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
      } = useForm()
    
const onSubmit = async (data) =>{
    try{
      setValue("marital_status", "Married")
      const token = sessionStorage.getItem('token');
      if(!token) throw new Error("No token");     
      const config = {
          headers: {
            "Authorization": `Bearer ${JSON.parse(token)}`,
					  "Content-Type": "application/json",
        }
      };
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/hotel/user/register`, data, config);
      console.log('Login success:', response.data);
      setRegistered(true)
      reset();
    }
    catch(error){
        console.log(error)
    }
   
}
  return (
    <motion.div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 m-3 border border-gray-700 mb-8'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
     <h1 className='text-2xl font-bold text-gra100'>Add user</h1>
    {registered && <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
      <span class="font-medium">User</span> registered.
    </div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="input-wrapper flex flex-col">
          <input className={`border p-2 w-full rounded focus:outline-none 
            ${errors.first_name ? 'border-red-500': 'border-gray-500'}`}
           placeholder='First Name'
            type="text"
            {...register('first_name', {
              required: 'First Name is required',
              minLength: {
                value: 1,
                message: 'First Name must be at least 2 characters',
              },
            })}
          />
          {errors.first_name && (
            <p className="text-xs italic text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div className="input-wrapper flex flex-col">
          <input className={`border p-2 w-full rounded focus:outline-none 
            ${errors.last_name ? 'border-red-500':'border-gray-500'}` 
          }
        
          type="text"
          placeholder='Last Name'
          {...register('last_name',{
            required: 'Last Name is required',
            minLength: {
              value: 1,
              message: 'First Name should be at least two characters'
            }
          })}/>
          {errors.last_name && <p className='text-xs italic text-red-500'>{errors.last_name.message}</p>}
        </div>
        <input className='hidden' {...register("marital_status")} />
        <div className="input-wrapper flex flex-col"> 
          <input className={`border p-2 w-full rounded focus:outline-none 
            ${errors.email ? 'border-red-500': 'border-gray-500'}`}
            type="email"
            placeholder='Email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-xs italic text-red-500">{errors.email.message}</p>}
        </div>
        <div className="input-wrapper flex flex-col"> 
          <input className={`border p-2 w-full rounded focus:outline-none 
            ${errors.phone_number ? 'border-red-500': 'border-gray-500'}`}
            type="phone"
            placeholder='Phone'
            {...register('phone_number', {
              required: 'Phone is required',
              pattern: {
                value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i,
                message: 'Invalid Phone Number',
              },
            })}
          />
          {errors.phone_number && <p className="text-xs italic text-red-500">{errors.phone_number.message}</p>}
        </div>

        <div className='input wrapper flex flex-col'>
          <select
          {...register("gender", { required: true })}
          className={`border p-2 w-full rounded focus:outline-none 
            ${errors.gender ? 'border-red-500': 'border-gray-500'}`}>
              <option className="bg-cyan-500" value="">Select gender</option>
              <option className="bg-cyan-500" value="male">Male</option>
              <option className="bg-cyan-500" value="female">Female</option>
            </select>
            {errors.gender && <p className="text-xs italic text-red-500">Gender is required.</p>}
        </div>

        <div style={{ position: 'relative' }}>
          <input className={`border p-2 w-full rounded 
            ${errors.password ? 'border-red-500':'border-gray-500'}`}
           style={{ width: '100%', paddingRight: '60px' }}
           placeholder='Password'
            type={showPassword? 'text': 'password'}
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                message: 'Password must be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
              },
            })}
          />
          <span
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
          }}
        >
          {showPassword ? <EyeOff size={20}/> : <Eye size={20}/> }
        </span>
          {errors.password && (
            <p className="text-xs italic text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <input className={`border p-2 w-full rounded 
            ${errors.password ? 'border-red-500':'border-gray-500'}`}
           style={{ width: '100%', paddingRight: '60px' }}
           placeholder='Verify Password'
            type={showPassword? 'text': 'password'}
            {...register('vpassword', {
              required: 'Password is required',
            })}
          />
          <span
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
          }}
        >
          {showPassword ? <EyeOff size={20}/> : <Eye size={20}/> }
        </span>
          {errors.vpassword && (
            <p className="text-xs italic text-red-500">{errors.vpassword.message}</p>
          )}
        </div>
        <div className='input wrapper flex flex-col'>
          <select
            {...register("role", { required: true })}
            className={`border p-2 w-full rounded focus:outline-none 
            ${errors.role ? 'border-red-500': 'border-gray-500'}`}>
            <option className="bg-cyan-500" value="">--------------Select role--------------</option>
            <option className="bg-cyan-500" value="ADMIN">Admin</option>
            <option className="bg-cyan-500" value="SUPER_ADMIN">Super admin</option>
            <option className="bg-cyan-500" value="MANAGER">Manager</option>
            <option className="bg-cyan-500" value="RECEPTION">Receptionist</option>
          </select>
          {errors.role && <p className="text-xs italic text-red-500">Status is required.</p>}
        </div>
        <div className="input-wrapper">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-green-700 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
  </motion.div>
  
  )
}

export default Registration