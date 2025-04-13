import React, { useState, useEffect } from "react";
import axios from "axios";
import {motion} from 'framer-motion'
import RoomRegisterForm from "./RoomRegisterForm";
import { Table } from "lucide-react";

const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your API
// const countries = ["United States", "Canada", "India", "Germany", "France", "Australia"];

const CRUDTable = () => {
  const [data, setData] = useState([]);
//   const [formData, setFormData] = useState({ id: "", title: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [roomRegisterForm, setRoomRegisterForm] = useState(false);
  const [openData, setOpenData] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
   const [countries, setCountries] = useState([]);
  const [selectedCountry,setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    skills: [],
    country: "",
    address: [{ street: "", city: "", plz:"" }],
  });

  const [errors, setErrors] = useState({});

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);
 useEffect(() => {
    // Fetch country data from API
    axios.get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryNames = response.data.map((country) => country.name.common);
        countryNames.sort(); // Sorting alphabetically
        setCountries(countryNames);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.slice(0, 5)); // Limiting data for demo
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

//   // Handle Form Input
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let updatedSkills = [...formData.skills];
      if (checked) {
        updatedSkills.push(value);
      } else {
        updatedSkills = updatedSkills.filter((skill) => skill !== value);
      }
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle dynamic address fields
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddress = [...formData.address];
    newAddress[index][name] = value;
    setFormData({ ...formData, address: newAddress });
  };

  // Add new address field
  const addAddressField = () => {
    setFormData({ ...formData, address: [...formData.address, { street: "", city: "" }] });
  };

  // Remove address field
  const removeAddressField = (index) => {
    const newAddress = [...formData.address];
    newAddress.splice(index, 1);
    setFormData({ ...formData, address: newAddress });
  };

  // Form validation
  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.age || isNaN(formData.age) || formData.age < 18) errors.age = "Age must be 18+";
    if (!formData.gender) errors.gender = "Select gender";
    if (formData.skills.length === 0) errors.skills = "Select at least one skill";
    if(!formData.country) errors.country = "Country is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/posts", formData);
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        age: "",
        gender: "",
        skills: [],
        country: "",
        address: [{ street: "", city: "" }],
      });
      setRoomRegisterForm(false);
      setOpenData(true)

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Create New Record
  const handleCreate = async () => {
    try {
      const response = await axios.post(API_URL, formData);
      setData([...data, response.data]);
      setFormData({ id: "", title: "" });
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  // Update Record
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      setData(data.map((item) => (item.id === formData.id ? formData : item)));
      setFormData({ id: "", title: "" });
      setIsEditing(false);
      setOpenData(true)
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  // Open Delete Dialog
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  // Open Add new Room form
  const handleAddRoomClick = () =>{
    setOpenData(false);
    setRoomRegisterForm(true)
    console.log(`this is a status from room register${roomRegisterForm}`)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedId}`);
      setData(data.filter((item) => item.id !== selectedId));
      setOpen(false);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <motion.div 
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}>
      <div className='flex justify-between items-center mb-6'>
       
				<h2 className='text-xl font-semibold text-gray-100'>{openData?"Rooms List":"New Room"}</h2>
                {openData && 
                <button onClick={()=> {setRoomRegisterForm(true), setOpenData(false),setIsEditing(false), console.log(countries)}}
                className="bg-green-500 text-white px-4 py-2 rounded">Add new Room
        </button>
}
                 </div>
      {/* <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Record" : "Add Record"}</h2> */}

      
      
      <div className="mb-4">{isEditing &&
      <div>
        <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
          <input
          type="text"
          name="title"
          placeholder="Enter Room Number"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <button
        onClick={isEditing ? handleUpdate : handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Edit Room
      </button>
      </div>
      }
      </div>
      <div>
        {roomRegisterForm &&
        <div>
            {/* <h2 className="text-2xl font-bold mb-4">New Room</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block font-semibold">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold">Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {/* {formData.gender=='Male'&& <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                name="gender"
                placeholder="Street"
                value={'Male'}
                onChange={(e) => handleAddressChange(e)}
                className="border p-2 rounded w-1/2"
              /></div>} */}
        </div>
        <div className="p-4">
      <label className="block mb-2 text-lg font-semibold">Select a Country:</label>
      <select
        className="p-2 border rounded-md"
        value={formData.country}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">-- Choose a Country --</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
          </option>
        ))}
      </select>
      {selectedCountry && <p className="mt-2">You selected: {selectedCountry}</p>}
    </div>

        {/* Skills */}
        <div>
          <label className="block font-semibold">Skills:</label>
          <div className="flex gap-4">
            {["React", "Node.js", "Python", "Java"].map((skill) => (
              <label key={skill}>
                <input type="checkbox" name="skills" value={skill} onChange={handleChange} /> {skill}
              </label>
            ))}
          </div>
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
        </div>

        {/* Address Fields */}
        <div>
          <label className="block font-semibold">Address:</label>
          {formData.address.map((addr, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={addr.street}
                onChange={(e) => handleAddressChange(index, e)}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={addr.city}
                onChange={(e) => handleAddressChange(index, e)}
                className="border p-2 rounded w-1/3"
              />
               <input
                type="PLZ Number"
                name="plz"
                placeholder="PLZ Number"
                value={addr.plz}
                onChange={(e) => handleAddressChange(index, e)}
                className="border p-2 rounded w-1/3"
              />
              <button type="button" onClick={() => removeAddressField(index)} className="text-red-500 font-bold">
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addAddressField} className="text-blue-500">
            + Add Address
          </button>
        </div>

        {/* Submit Button */}
        <button onClick={()=> setFormData} type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
        </div>
        }
      </div>
      
      <div>{openData?
      <table className='min-w-full divide-y divide-gray-700'>
      <thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Title
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Actions
							</th>
                            
						</tr>
					</thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{item.id}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{item.title}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                <button
                  onClick={() => {
                    setFormData(item);
                    setIsEditing(true);
                    setOpenData(false)
                  }}
                  className="bg-yellow-800 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded mr-4"
                >
                  Delete
                </button>
                {/* <button
                  onClick={() => {
                    setRoomRegisterForm(true)
                    setOpenData(false)
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add Room
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
: <table className='min-w-full divide-y divide-gray-700'>
    <tbody>


    </tbody>
</table>}
      </div>

      {/* Delete Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-blue-950 p-6 rounded shadow-lg">
            <p className="text-lg font-semibold">Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CRUDTable;
