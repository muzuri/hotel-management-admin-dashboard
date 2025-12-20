import React, { useState } from "react";
import {motion} from 'framer-motion';

const PromoRegister = ({updateMessage}) => {
  const [showHeader, setShowHeader] = useState(true)
  const [formData, setFormData] = useState({});
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
      const token = sessionStorage.getItem('token');
			if(!token) return;
      console.log(token)
      console.error(formData)
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setFormData({
        size: "",
        bed_size:"",
        floorNo: "",
        number_bed:"",
        promo_category: "",
        view: "",
        price:"",
        currency: "",
        promo_desc: "",
        branch_id: "",
        promo_num:"",
        shared:true
      });
    setShowHeader(false)
    // setOpenData(true)
    // updateMessage("yes")

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
      <h2 className="text-2xl font-bold mb-4">Add Promo</h2>
      <div className='relative'></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Promo Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>} */}
        </div>
        <div>
            <label className="block font-semibold">Price (€)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          {/* {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>} */}
        </div>
        {/* Bed Size */}
        <div>
          <label className="block font-semibold">Starting date</label>
          <input
            type="date"
            name="starting_date"
            value={formData.starting_date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.branch_id && <p className="text-red-500 text-sm">{errors.branch_id}</p>} */}
        </div>
        <div>
          <label className="block font-semibold">End date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {/* {errors.floorNo && <p className="text-red-500 text-sm">{errors.floorNo}</p>} */}
        </div>
        {/* size */}
        <div>
          <label className="block font-semibold">Percent off</label>
          <input
            type="number"
            min={0}
            max={100}
            name="percent"
            value={formData.percent}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Comment</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
          {/* {errors.number_bed && <p className="text-red-500 text-sm">{errors.number_bed}</p>} */}
        {/* Currency */}
        {/* Promo Description */}
        <br></br>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      </div> }
    </motion.div>
        
  );

}

export default PromoRegister;
