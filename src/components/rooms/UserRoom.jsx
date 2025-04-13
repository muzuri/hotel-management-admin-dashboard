import React, { useState, useEffect } from 'react'
import {motion} from 'framer-motion'
// const defaultValues = {
//     name: "Name",
//     email: "Email Address",
//     age: 40,
//     country: "USA",
//   };
  const defaultValues = {
    size: "room size",
      bed_size: "bed-size",
      floorNo: "Floor no",
      number_bed: "32",
      room_category: "Normal",
      has_balcony:"",
      view:"has view",
      price:"",
      currency:"",
      room_desc:"",
      branch_id:1
  }
const UserRoom = () => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
      // Simulating fetching default values from an API
  useEffect(() => {
      setFormData({
        name: "Alice Smith",
        email: "alice@example.com",
        age: 30,
        country: "Canada",
      });
      setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email.includes("@")) tempErrors.email = "Invalid email";
    if (formData.age <= 0) tempErrors.age = "Age must be greater than zero";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formData);
      alert("Form Submitted Successfully!");
    //   setFormData(defaultValues);
    }
  };

  const handleReset = () => {
    setFormData(defaultValues);
    setErrors({});
  };

  if (loading) return <p>Loading form...</p>;
  return (
    <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    >
        <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Register Test Form</h2>
        </div>
        <h2 className="text-lg font-bold mb-4">Advanced React Form</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div>
          {/* <label className="block font-medium">Name</label> */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          {/* <label className="block font-medium">Email</label> */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.age && <p className="text-red-500">{errors.age}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block font-medium">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
          <button type="button" onClick={handleReset} className="bg-gray-400 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </form>
        
        </motion.div>
  )
}

export default UserRoom