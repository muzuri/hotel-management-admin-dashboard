import React from 'react'
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5"
import axios from 'axios';

import Buttons from '../common/Buttons';
import LoadingRing from '../common/LoadingRing';

const PromosTable = ({updateMessage}) => {
    const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
	const [selectedRow, setSelectedRow] = useState(null);
    const[selectedPromo, setSelectedPromo] = useState(null);
    const[showPromosTable, setShowPromosTable]= useState(true);
	const[showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		size:"",
		promo_num:"",
		currency: "",
		price:"",
		status:"",
		matt_size:"",
		magnitude:"",
		promo_size_name:""
	  });
    const [buttons] = useState([
          {
            id: 1,
            label: "Add new Promo",
            disabled: false,
            icon: <IoAddCircle size={18}/>,
            onClick: ()=> updateMessage("newPromo"),
          },
          {
            id: 2,
            label: "Add new Room",
            disabled: false,
            icon: <IoAddCircle size={18}/>,
            onClick: ()=> updateMessage("newRoom"),
          }
        ]);
	useEffect(() => {
	  // Fetch data from API
	  const url = `${import.meta.env.VITE_API_BASE_URL}/hotel/promo`
	  const fetchData = async () => {
		try {
			const token = sessionStorage.getItem('token');
			if(!token) return;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${JSON.parse(token)}`,
					"Content-Type": "application/json",  // if you're sending JSON
				}
			});
			const result = await response.json();
			console.log(result);
			setData(result);
			setFilteredData(result); // Initialize filteredData with full data
			console.log("Promos status is" + result)
		} catch (error) {
		  console.error("Error fetching data:", error);
		}
	  };
	  fetchData();
	  setIsLoading(false)
	}, []);
  
	useEffect(() => {
	  // Filter data based on search input
	//   const filtered = data.filter((item) =>
	// 	item.currency.toLowerCase().includes(search.toLowerCase())
	//   );
	//   setFilteredData(filtered);
	}, [search, data]);
	const closeModal = () => {
		setSelectedPromo(null);
		setFormData(
		  {
			size:"",
			promo_num:"",
			currency: "",
			price:"",
			status:"",
			matt_size:"",
			magnitude:"",
			promo_size_name:""
		  }
		);
		setShowModal(false);
		setShowPromosTable(true);
	  };
	   // Delete Function
  const handleDelete = async (promoId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!promoId) return;

    try {
		const token = sessionStorage.getItem('token')
		if(!token) return;
		await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/promo/${promoId}`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${JSON.parse(token)}`,
				"Content-Type": "application/json",  // if you're sending JSON
			}
		});

      // Update State After Deletion
    setData(data.filter((item)=> item.id !== promoId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleChangeStatus = async(promoId) => {
	try{
		const token = sessionStorage.getItem('token')
		if(!token) return;
		await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/hotel/promo/${promoId}`,{
				method:"POST",
				headers: {
					"Authorization": `Bearer ${JSON.parse(token)}`,
					"Content-Type": "application/json",  // if you're sending JSON
				}
			});
			   // Update State After Deletion
		setData(data.filter((item)=> item.id !== promoId))

	}
	catch(error) {
		console.error("Error in activating promo status:", error);
	}
  }
  const handleUpdate = async () => {
	try {
		const token = sessionStorage.getItem('token');
		if(!token) return;
	  	await axios.put(
		`${import.meta.env.VITE_API_BASE_URL}/hotel/promo/${selectedPromo.id}`,{
			headers: {
				Authorization: `Bearer ${JSON.parse(token)}`
			}
		},
		formData
	  );
  
	  const newData = filteredData.map((u) =>
		u.id === selectedPromo.id ? { ...u, ...formData } : u
	  );
	//   console.log("new data are the following:")
	//   console.log(newData);
	  setData(newData);
	  closeModal();
	} catch (err) {
	  console.error("Update error:", err);
	}
  };
	  const openEditModal = (row) => {
		setSelectedPromo(row);
		console.log(row);
		setFormData(
		  {
		size:row.size,
		promo_num:row.promo_num,
		currency: row.currency,
		price:row.price,
		status:row.status,
		matt_size:row.matt_size,
		magnitude:row.magnitude,
		promo_size_name:row.promo_size_name
		  }
		);
		setShowModal(true);
		setShowPromosTable(false)
	  };
	//   const openEdit = ()=> {
	// 	setShowModal(true)
	// 	setShowPromosTable(false)
	//   }
	  const handleClose= () => {
		setSelectedRow(null);
		setShowPromosTable(true);
	  }
	  
		// Render loading, error, or data depending on the state
		if (isLoading) {
		  return <LoadingRing></LoadingRing>
		}
	  
		// if (error) {
		//   return <div>Error: {error}</div>;
		// }
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>   
        <div className='flex gap-4 p-6'>
                {buttons.map((btn) => (
                <motion.button
                  key={btn.id}
                  whileTap={{ scale: 0.95 }}
                  disabled={btn.disabled}
                  onClick={btn.onClick}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium shadow-md transition-all
                    ${btn.disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-indigo-600 text-white"}`}
                >
                  {btn.icon}
                  {btn.label}
                </motion.button>
              ))}
            </div>
			<div className='flex justify-between items-center mb-6'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search Room...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>
            <h2 className='text-xl font-semibold text-gray-100 text-center'>Active Promos in Hotel</h2>
			<div className='overflow-x-auto'>
				{showPromosTable && 
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Promo Id
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Percent off
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Code
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Comment
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Price
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Starting date
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Ending date
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>		
          {filteredData.length > 0 ? (
           filteredData.map((promo) => (
			<motion.tr
				key={promo.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{promo.id}
				</td>
		
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{promo.percent !==0  && (100 - promo.percent) + '% OFF'} 
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{promo.code}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{promo.comment}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{promo.currency}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{promo.price}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{promo.starting_date}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{promo.end_date}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
				<button className='text-red-400 hover:text-red-300' onClick={() => handleChangeStatus(promo.id)}>
						<X size={18} />
					</button>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={()=> openEditModal(promo)}>
						<Edit size={18} />
					</button>
					<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(promo.id)}>
						<Trash2 size={18} />
					</button>
				</td>
			</motion.tr>
		))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">No data found</td>
            </tr>
          )}
        </tbody>
				</table>
}

			</div>
			{showModal && (
        <div className="bg-gray-800 bg-opacity-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 bg-opacity-50 bg-opacity-50 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Promo Size</label>
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
                <label className="block mb-1 text-sm font-medium">Promo Number</label>
                <input
                      type="text"
                      name="promo_num"
                      value={formData.promo_num}
                      onChange={(e) =>
                        setFormData({ ...formData, promo_num: e.target.value })
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
                <label className="block mb-1 text-sm font-medium">Status</label>
                <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
			    	{/* 
		matt_size:"",
		magnitude:"",
		promo_size_name:"" */}
              <div>
                <label className="block mb-1 text-sm font-medium">Mattress Size</label>
                <input
                      type="text"
                      name="matt_size"
                      value={formData.matt_size}
                      onChange={(e) =>
                        setFormData({ ...formData, matt_size: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Magnitude</label>
                <input
                      type="text"
                      name="magnitude"
                      value={formData.magnitude}
                      onChange={(e) =>
                        setFormData({ ...formData, magnitude: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Promo Size Name</label>
                <input
                      type="text"
                      name="promo_size_name"
                      value={formData.promo_size_name}
                      onChange={(e) =>
                        setFormData({ ...formData, promo_size_name: e.target.value })
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
		</motion.div>
	);
}

export default PromosTable