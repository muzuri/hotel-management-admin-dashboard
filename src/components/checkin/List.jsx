import React, { useEffect, useState, useMemo, useContext } from 'react'
import { Search, Settings, Plus} from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import {motion} from 'framer-motion'
import { Eye } from 'lucide-react';
import axios from 'axios';
import LoadingRing from '../common/LoadingRing';
import { isTokenExpired } from '../../context/AuthUtil'
import { AuthContext } from '../../context/AuthContext';

const CheckTable = ({updateMessage,bookedRom }) => {
    // State to hold the data, loading status, and any errors
    const [checks, setCheck] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [checkId, setCheckId] = useState(null);
    const [filtered, setFiltered] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered data
    const [isDelete, setIsDelete] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const[selectedCheck, setSelectedCheck] = useState(null);
    const[showChecksTable, setShowChecksTable]= useState(true);
    const [register, setRegister] = useState(false);
    const [editRowId, setEditRow] = useState(null);
    const[showModal, setShowModal] = useState(false);
    const[role, setRole] = useState('');
    const { logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
      size: "",
      bed_size: "",
      floorNo: "",
      number_bed: "",
      check_category: "",
      view:"",
      price:"",
      currency:"",
      check_desc:"",
      check_num:"",
      branch_id:1
    });
    const [buttons] = useState([
      {
        id: 1,
        allowed: ['ADMIN', 'SUPER_ADMIN', 'MANAGER'],
        label: "Add new Check",
        disabled: false,
        icon: <IoAddCircle size={18}/>,
        onClick: ()=> updateMessage("newCheck"),
      },
    ]);
    // Fetch data when the component mounts
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        setError("No token found");
        return;
    }
    if(isTokenExpired(token)){
      console.error('Token is expired...')
      logout()
    }
    handleRole()
    // Define the URL of the API
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/checkIn`;
    // Fetch data
    fetch(url, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${JSON.parse(token)}`,
              "Content-Type": "application/json",  // if you're sending JSON
              "Accept": "application/json"
          }})
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok---'+response.status);
        }
        return response.json();
      })
      .then((data) => {
        setCheck(data);  // Store the fetched data
        setLoading(false);  // Set loading to false once the data is fetched
      })
      .catch((error) => {
        setError(error.message);  // Store any error that occurs during the fetch
        setLoading(false);  // Set loading to false if an error occurs
        console.log(error.message)
      });
  }, []);
  const handleRole=()=>{
      const userObj = sessionStorage.getItem('user');
      if(!userObj) return;
      const user = JSON.parse(userObj);
      setRole(user.role)
  }
   // Empty dependency array means it runs once when the component mounts
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = checks.filter(
        (check) => check.check_category.toLowerCase().includes(term) || check.check_desc.toLowerCase().includes(term)
    );
    setCheck(filtered);
    setLoading(false)
};
  // Delete Function
  const handleDelete = async (checkId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Check with Check Number ${checkId}?`);
    if(confirmDelete){
    if (!checkId) return;

    try {
      const token = sessionStorage.getItem('token');
      if(!token) return;
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/check/${checkId}`, {
        method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${JSON.parse(token)}`,
                    "Content-Type": "application/json",  // if you're sending JSON
                }
      });

      // Update State After Deletion
    setCheck(checks.filter((item)=> item.id !== checkId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }};
const clickEdit =()=>{
    updateMessage("editCheck")
}
const handleView = (check) => {
  setSelectedRow(check);
  setShowChecksTable(false);
}

const handleUpdate = async () => {
  try {
    const token = sessionStorage.getItem('token')
    if(!token) return;
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/hotel/check/${selectedCheck.id}`,{
        headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
      },
      formData
    );

    const newData = checks.map((u) =>
      u.id === selectedCheck.id ? { ...u, ...formData } : u
    );
    setCheck(newData);
    closeModal();
  } catch (err) {
    console.error("Update error:", err);
  }
};
const closeModal = () => {
  setSelectedCheck(null);
  setFormData(
    {
      id:"",
      size: "",
      bed_size: "",
      floorNo: "",
      number_bed: "",
      check_category: "",
      view:"",
      price:"",
      currency:"",
      check_desc:"",
      check_num:"",
      branch_id:1
    }
  );
  setShowModal(false);
  setShowChecksTable(true);
};
const openEditModal = (row) => {
  setSelectedCheck(row);
  setFormData(
    {
      id:row.id,
      size: row.size,
      bed_size: row.bed_size,
      floorNo: row.floorNo,
      number_bed: row.number_bed,
      check_category: row.check_category,
      view:row.view,
      price:row.price,
      currency:row.currency,
      check_desc:row.check_desc,
      branch_id:row.branch_id,
      check_num:row.check_num
    }
  );
  setShowModal(true);
  setShowChecksTable(false)
};
const handleClose= () => {
  setSelectedRow(null);
  setShowChecksTable(true);
}

  // Render loading, error, or data depending on the state
  if (loading) {
    return <LoadingRing></LoadingRing>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >

            <div className='flex justify-between items-end mb-6'>
      <div className='flex gap-4 p-6'>
        {buttons.map((btn) => (<>
        {(role && btn.allowed.includes(role)) &&<motion.button
          key={btn.id}
          whileTap={{ scale: 0.95 }}
          disabled={btn.disabled}
          onClick={btn.onClick}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium shadow-md transition-all
            ${btn.disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-indigo-600 text-white"}`}
        >
          {btn.icon}
          {btn.label}
        </motion.button>}</>
      ))}
    </div>
        <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search check...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
        </div>
        {selectedRow && (
          <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">{`Information about ${selectedRow.check_desc}`}</h3>
          <p><strong>Check Description:</strong> {selectedRow.check_desc}</p>
          <p><strong>Price:</strong> {selectedRow.price}</p>
          <button
            onClick={handleClose}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
          </div>
        
      )}

    
            <div className='overflow-x-auto'>
      {showChecksTable && 
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                                Check id
                            </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Names
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Passport
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Email
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Phone
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Check-in
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Check-out
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Nationality
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Date of birth
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              City
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Street
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Country
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                              Post Code
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide divide-gray-700'>
                        {checks.map((check) => (
                            <motion.tr
                                key={check.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.id}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                              {check.first_name}  {check.last_name}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.passport_number}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.email}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.phone}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.nationality}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.checking_in_date}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.checking_out_date}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.date_birth_customer}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.city}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.street}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.country}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{check.post_code}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                  <button
                    onClick={() => openEditModal(check)}
                    className="bg-blue-500 text-white px-3 mr-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button className='bg-amber-500 text-blue-700 hover:text-cyan-700  px-3 py-1 rounded' onClick={()=> handleView(check)}>View</button>
                  <button className='text-red-500 hover:text-red-300 mr-4 px-3 py-1 rounded'
                  onClick={() => handleDelete(check.id)}>Delete</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
     }
        {/* Edit Modal */}
      {showModal && (
        <div className="bg-gray-800 bg-opacity-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-50 bg-opacity-50 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Check</h3>
            <div className="space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Check Number</label>
                <input
                      type="text"
                      name="check_num"
                      value={formData.check_num}
                      onChange={(e) =>
                        setFormData({ ...formData, check_num: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Check Size</label>
                <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Bed Size</label>
                <input
                      type="text"
                      name="bed_size"
                      value={formData.bed_size}
                      onChange={(e) =>
                        setFormData({ ...formData, bed_size: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Floor No</label>
                <input
                      type="text"
                      name="floorNo"
                      value={formData.floorNo}
                      onChange={(e) =>
                        setFormData({ ...formData, floorNo: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Number of Beds</label>
                <input
                      type="text"
                      name="number_bed"
                      value={formData.number_bed}
                      onChange={(e) =>
                        setFormData({ ...formData, number_bed: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">View Info</label>
                <input
                      type="text"
                      name="view"
                      value={formData.view}
                      onChange={(e) =>
                        setFormData({ ...formData, view: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Check Category</label>
                <input
                      type="text"
                      name="check_category"
                      value={formData.check_category}
                      onChange={(e) =>
                        setFormData({ ...formData, check_category: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Check Description</label>
                <input
                      type="text"
                      name="check_desc"
                      value={formData.check_desc}
                      onChange={(e) =>
                        setFormData({ ...formData, check_desc: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Price</label>
                <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Currency</label>
                <input
                      type="text"
                      name="currency"
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Branch Id</label>
                <input
                      type="text"
                      name="branch_id"
                      value={formData.branch_id}
                      onChange={(e) =>
                        setFormData({ ...formData, branch_id: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
            </div>
        </motion.div>
  )
}

export default CheckTable