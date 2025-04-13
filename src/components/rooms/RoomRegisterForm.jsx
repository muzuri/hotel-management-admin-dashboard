import React, { useState } from "react";
import axios from "axios";
import {motion} from 'framer-motion';
import * as yup from "yup"
const defaultValues = {
  size: "",
    bed_size: "",
    floorNo: "",
    number_bed: "",
    room_category: "",
    view:"",
    price:"",
    currency:"",
    room_desc:"",
    branch_id:1
}
    

const RoomRegisterForm = ({updateMessage, changeRegister}) => {
  const [showHeader, setShowHeader] = useState(true)
  const [formData, setFormData] = useState({
    // size: "200 m",
    // bed_size: "",
    // floorNo: "",
    // number_bed: "",
    // room_category: "",
    // view:"",
    // price:"",
    // currency:"",
    // room_desc:"",
    // branch_id:1
  });

  const [errors, setErrors] = useState({});
  
  // const validateForm = () => {
  //   let errors = {};
  //   if (!formData.size) errors.size = "Size of Room in Meter is required";
  //   if (!formData.branch_id) errors.branch_id = "Branch Number is required";
  //   if (!formData.floorNo) errors.floorNo = "floor number of the hotel is required";
  //   if (!formData.number_bed) errors.number_bed = "floor number of the hotel is required";
  //   if (!formData.room_category) errors.room_category = "room category is required";
  //   if (!formData.view) errors.view = "room review is required";
  //   if (!formData.price) errors.price = "price of the room is required";
  //   if (!formData.currency) errors.currency = "Currency is required";
  //   if (!formData.room_desc) errors.room_desc = "Room description is required";
  //   setErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
    try {
      const res = await fetch("http://localhost:8080/hotel/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setFormData({
        created_by: "",
        size: "",
        floorNo: "",
        number_bed:"",
        room_category: "",
        view: "",
        price:"",
        currency: "",
        room_desc: "",
        branch_id: ""
      });
    setShowHeader(false)
    // setOpenData(true)
    updateMessage("yes")

    } catch (error) {
      console.error("Error submitting form:", error);
    }

      

   
  };

  return (
   <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    > {showHeader && <div>
       <h2 className="text-2xl font-bold mb-4">Add Room</h2>
      <div className='relative'>
                <button onClick={()=> {updateMessage("yes"); console.log("Hello ------")}}
                className="bg-green-500 text-white px-4 py-2 rounded">Change State from parent
        </button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Room Size in SQM</label>
          <input
            type="text"
            name="name"
            value={formData.size}
            onChange={handleChange}
            className="border p-2 w-full rounded bg-amber-200 text-black"
            required
          />
          {/* {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>} */}
        </div>
        {/* Bed Size */}
        <div>
          <label className="block font-semibold">Hotel Branch Number</label>
          <input
            type="text"
            name="name"
            value={formData.branch_id}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.branch_id && <p className="text-red-500 text-sm">{errors.branch_id}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Hotel Floor Number</label>
          <input
            type="text"
            name="name"
            value={formData.floorNo}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.floorNo && <p className="text-red-500 text-sm">{errors.floorNo}</p>} */}
        </div>
        {/* size */}
        <div>
          <label className="block font-semibold">Number of Bed</label>
          <input
            type="text"
            name="name"
            value={formData.number_bed}
            onChange={handleChange}
            className="border p-1 min-w-200 rounded"
            required
          />
          {/* {errors.number_bed && <p className="text-red-500 text-sm">{errors.number_bed}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Room Category</label>
          <input
            type="text"
            name="name"
            value={formData.room_category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.room_category && <p className="text-red-500 text-sm">{errors.room_category}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Room View</label>
          <input
            type="text"
            name="name"
            value={formData.view}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Room Price</label>
          <input
            type="text"
            name="name"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>} */}
        </div>
        {/* Currency */}
          <div>
          <label className="block font-semibold">Currency:</label>
          <input
            type="text"
            name="name"
            value={formData.currency}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>} */}
        </div>
         {/* Room Description */}
         <div>
          <label className="block font-semibold">Room Description</label>
          <input
            type="text"
            name="name"
            value={formData.room_desc}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.room_desc && <p className="text-red-500 text-sm">{errors.room_desc}</p>} */}
        </div>
        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      </div> }
    </motion.div>
        
  );

}

export default RoomRegisterForm;
