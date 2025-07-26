import React, {useState} from 'react'
import {motion} from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios'



const Registration = () => {
    const [showPassword, setShowPassword] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()

      // Helper: Check if user is 18+
      const isAdult = (dateString) => {
        const today = new Date();
        const dob = new Date(dateString);
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        return (
          age > 18 || (age === 18 && m >= 0 && today.getDate() >= dob.getDate())
        );
      };
    
const onSubmit = async (data) =>{
    try{
        const response = await axios.post('https://xenonhostel.com/api/hotel/public/register', data);
        console.log('Login success:', response.data);
    }
    catch(error ){
        console.log(error)
    }
   
}
  return (
    <motion.div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
     <h1 className='text-2xl font-bold text-gra100'>Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="input-wrapper flex flex-col">
          <input
          className={`border p-2 w-full rounded focus:outline-none 
            ${errors.first_name ? 'border-red-500': 'border-gray-500'}`}
           placeholder='First Name'
            type="text"
            {...register('first_name', {
              required: 'First Name is required',
              minLength: {
                value: 2,
                message: 'First Name must be at least 2 characters',
              },
            })}
          />
          {errors.first_name && (
            <p className="text-xs italic text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        {
// "first_name": "Muzuri",
// "last_name": "Aimable",
// "password":"Jesus123!@",
// "marital_status":"Maried",
// "email":"muzuri31@gmail.com",
// "role":"MANAGER",
// "gender": "Male",
// "date_birth":"2027-06-29",
// "phone_number":"015210563098887",
// "created_by":"Aima",
// "updated_by":"Akaliza"
 }
       <div className='input wrapper flex flex-col'>
<select
  {...register("marital_status", { required: true })}
  className="w-full p-2 border border-gray-300 rounded"
>
  <option value="">Select Marital Staus</option>
  <option value="maried">Maried</option>
  <option value="single">Single</option>
  <option value="other">Divorced</option>
</select>
{errors.marital_status && <p className="text-red-500 text-sm">Status is required.</p>}
        </div>
        <div className="input-wrapper flex flex-col">
          <input
          className={`border p-2 w-full rounded focus:outline-none 
            ${errors.last_name ? 'border-red-500':'border-gray-500'}` 
          }
        
          type="text"
          placeholder='Last Name'
          {...register('last_name',{
            required: 'Last Name is required',
            minLength: {
              value: 2,
              message: 'First Name should be at least two characters'
            }
          })}/>
          {errors.last_name && <p className='text-xs italic text-red-500'>{errors.last_name.message}</p>}
        </div>

        <div className="input-wrapper flex flex-col"> 
          <input
          className={`border p-2 w-full rounded focus:outline-none 
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
          {errors.email && <p className="text-xs italic text-red-500">
            {errors.email.message}</p>}
        </div>

        <div className='input wrapper flex flex-col'>
          <select
          {
           ...register("gender", { required: true })}
          className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            </select>
            {
            errors.gender && <p className="text-red-500 text-sm">Gender is required.</p>}
        </div>

        <div style={{ position: 'relative' }}>
          <input
          className={`border p-2 w-full rounded 
            ${errors.password ? 'border-red-500':'border-gray-500'}`}
           style={{ width: '100%', paddingRight: '60px' }}
           placeholder='Password'
            type={showPassword? 'text': 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
                
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
        <div>
        <label className="block text-sm font-medium text-white mb-1">Date of Birth</label>
        <input
          type="date"
          {...register("date_birth", { 
            required: 'Date of birth is required.',
            validate: value => isAdult(value) || "You must be at least 18 years old."
           })}
          className="w-full p-2 border border-gray-300 rounded"
        />
         {errors.dob && (
  <p className="text-red-500 text-sm">
    {errors.date_birth.message || "Invalid date of birth."}
  </p>
)}
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