import React, { useState } from "react";
import {motion} from 'framer-motion';

const RoomRegisterForm = ({updateMessage, changeRegister, room_id}) => {
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
  const [shared, setShared] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
    try {
      const res = await fetch("https://api.xenonhostel.com/hotel/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setFormData({
        size: "",
        bed_size:"",
        floorNo: "",
        number_bed:"",
        room_category: "",
        view: "",
        price:"",
        currency: "",
        room_desc: "",
        branch_id: "",
        room_num:"",
        shared:true
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
                className="bg-green-500 text-white px-4 py-2 rounded"> View Rooms
        </button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Room Size in SQM</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Room Number</label>
          <input
            type="text"
            name="room_num"
            value={formData.room_num}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>} */}
        </div>
        {/* Bed Size */}
        <div>
          <label className="block font-semibold">Hotel Branch Number</label>
          <input
            type="text"
            name="branch_id"
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
            name="floorNo"
            value={formData.floorNo}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.floorNo && <p className="text-red-500 text-sm">{errors.floorNo}</p>} */}
        </div>
        {/* size */}
        <div>
          <label className="block font-semibold">Number of Beds</label>
          <input
            type="text"
            name="number_bed"
            value={formData.number_bed}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.number_bed && <p className="text-red-500 text-sm">{errors.number_bed}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Room Category</label>
          <input
            type="text"
            name="room_category"
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
            name="view"
            value={formData.view}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.view && <p className="text-red-500 text-sm">{errors.view}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">Bed Size</label>
          <input
            type="text"
            name="bed_size"
            value={formData.bed_size}
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
            name="price"
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
            name="currency"
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
            name="room_desc"
            value={formData.room_desc}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.room_desc && <p className="text-red-500 text-sm">{errors.room_desc}</p>} */}
        </div>
        {/* Submit Button */}

        <button className="bg-green-700 text-white px-4 p-2 rounded" onClick={console.log(shared)}>Shared Room</button>
        <br></br>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      </div> }
    </motion.div>
        
  );

}

export default RoomRegisterForm;
