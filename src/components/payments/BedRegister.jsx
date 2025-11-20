import React, { useState } from 'react'
import {motion} from 'framer-motion';



const BedRegister = ({updateMessage, room_id}) => {
  const defaultValues = {
    size:"",
    bed_num:"",
    currency: "",
    price:"",
    matt_size:"",
    magnitude:"",
    room_id:room_id,
    bed_size_name:""
}


    const [formData, setFormData] = useState(defaultValues)
    const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          const token = sessionStorage.getItem('token')
          if(!token) return;
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/bed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(token)}`,
            },
            body: JSON.stringify(formData),
          });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setMessage("Registration successful!");
        setFormData(defaultValues);
        // updateMessage("newB");
      } else {
        setMessage(data.error || "Something went wrong.");
        setFormData(defaultValues);

      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
    initial={{ opacity: 0, y: 2 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    > 
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
          type="text"
          name="size"
          placeholder="Bed Size"
          value={formData.size}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <br /><br />
        <input
          type="text"
          name="bed_num"
          placeholder="Bed Number"
          value={formData.bed_num}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <br /><br />
        <input
          type="text"
          name="currency"
          placeholder="Currency"
          value={formData.currency}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
               <br /><br />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
           <br /><br />
        <input
          type="text"
          name="matt_size"
          placeholder="Mattress Size"
          value={formData.matt_size}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
           <br /><br />
        <input
          type="text"
          name="magnitude"
          placeholder="Magnitude"
          value={formData.magnitude}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
                <br /><br />
                <p>{`Room is ${room_id}`}</p>
        <input
          type="text"
          name="room_id"
          placeholder={room_id}
          value={room_id}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
                <br /><br />
        <input
          type="text"
          name="bed_size_name"
          placeholder="Bed Size Name"
          value={formData.bed_size_name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          
          required
        />

        <br /><br />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Bed</button>
      </form>
      {message && <p>{message}</p>}
    </motion.div>
  )
}

export default BedRegister