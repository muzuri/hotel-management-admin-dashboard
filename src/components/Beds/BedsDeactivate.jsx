import React from 'react'
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Check } from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import { useState, useEffect } from "react";
import axios from 'axios';

import Buttons from '../common/Buttons';
import LoadingRing from '../common/LoadingRing';
import BackButton from '../common/BackButton';

const BedsDeactivate = () => {
    const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
	const [selectedRow, setSelectedRow] = useState(null);
    const[selectedBed, setSelectedBed] = useState(null);
    const[showBedsTable, setShowBedsTable]= useState(true);
	const[showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		size:"",
		bed_num:"",
		currency: "",
		price:"",
		status:"",
		matt_size:"",
		magnitude:"",
		bed_size_name:""
	  });
  
	useEffect(() => {
	  // Fetch data from API
	  const url = 'https://api.xenonhostel.com/hotel/bedDeactivate'
	  const fetchData = async () => {
		try {
		  const response = await fetch(url);
		  const result = await response.json();
		  console.log(result);
		  setData(result);
		  setFilteredData(result); // Initialize filteredData with full data
		} catch (error) {
		  console.error("Error fetching data:", error);
		}
	  };
	  fetchData();
	  setIsLoading(false)
	}, []);
  
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.currency.toLowerCase().includes(search.toLowerCase())
	  );
	  setFilteredData(filtered);
	}, [search, data]);
	const closeModal = () => {
		setSelectedBed(null);
		setFormData(
		  {
			size:"",
			bed_num:"",
			currency: "",
			price:"",
			status:"",
			matt_size:"",
			magnitude:"",
			bed_size_name:""
		  }
		);
		setShowModal(false);
		setShowBedsTable(true);
	  };
	   // Delete Function
  const handleDelete = async (bedId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!bedId) return;

    try {
      await fetch(`https://api.xenonhostel.com/hotel/bed/${bedId}`, {
        method: "DELETE",
      });

      // Update State After Deletion
    setData(data.filter((item)=> item.id !== bedId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleUpdate = async () => {
	try {
	  await axios.put(
		`https://api.xenonhostel.com/hotel/bed/${selectedBed.id}`,
		formData
	  );
  
	  const newData = filteredData.map((u) =>
		u.id === selectedBed.id ? { ...u, ...formData } : u
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
		setSelectedBed(row);
		console.log(row);
		setFormData(
		  {
		size:row.size,
		bed_num:row.bed_num,
		currency: row.currency,
		price:row.price,
		status:row.status,
		matt_size:row.matt_size,
		magnitude:row.magnitude,
		bed_size_name:row.bed_size_name
		  }
		);
		setShowModal(true);
		setShowBedsTable(false)
	  };
	//   const openEdit = ()=> {
	// 	setShowModal(true)
	// 	setShowBedsTable(false)
	//   }
	  const handleClose= () => {
		setSelectedRow(null);
		setShowBedsTable(true);
	  }
	  
		// Render loading, error, or data depending on the state
		if (isLoading) {
		  return <LoadingRing></LoadingRing>
		}
        const handleChangeStatus = async(bedId) => {
            try{
                await fetch(
                    `https://api.xenonhostel.com/hotel/bed/${bedId}`,{
                        method:"POST"
                    });
                       // Update State After Deletion
                setData(data.filter((item)=> item.id !== bedId))
        
            }
            catch(error) {
                console.error("Error in activating bed status:", error);
            }
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

        
			<div className='flex justify-between items-center mb-6'>
            {/* <div className='flex gap-4 p-6'>
                <Buttons key={1} label={'Add new Bed'} icon= {<IoAddCircle size={18}></IoAddCircle>} onClick={()=> updateMessage("assignBed")} ></Buttons>
                <Buttons id={2} label={'Booked Bed'}  icon = {<IoBed size={18}></IoBed>}onClick={()=> updateMessage("bookedBed")} ></Buttons>
                <Buttons id={3} label={'availableBed'} icon={<IoBed size={18}></IoBed>} onClick={()=> updateMessage("availableBed")} ></Buttons>
            </div> */}
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
            <h2 className='text-xl font-semibold text-gray-100 text-center'>Deactive Beds in Hotel</h2>
			<div className='overflow-x-auto'>
				{showBedsTable && 
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed Id
							</th>
                            {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Created By
							</th> */}
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								created date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Size
							</th>
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed number
							</th> */}
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room Number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed Status
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								 Bed Size Name
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Number of Person
							</th>
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Mattles Size
							</th> */}
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>		
          {filteredData.length > 0 ? (
           filteredData.map((bed) => (
			<motion.tr
				key={bed.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.id}
				</td>
				{/* <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
					<img
						src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
						alt='Product img'
						className='size-10 rounded-full'
					/>
					{bed.created_by}
				</td> */}

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.created_at}
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.size}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.room_id}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.currency}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.price}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.bed_active?"Active":"deactive"}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.bed_size_name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.magnitude}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                <button className='text-green-700 hover:text-red-300' onClick={() => handleChangeStatus(bed.id)}>
						<Check size={18} />
						
					</button>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={()=> openEditModal(bed)}>
						<Edit size={18} />
					</button>
					<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(bed.id)}>
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
                <label className="block mb-1 text-sm font-medium">Bed Size</label>
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
                <label className="block mb-1 text-sm font-medium">Bed Number</label>
                <input
                      type="text"
                      name="bed_num"
                      value={formData.bed_num}
                      onChange={(e) =>
                        setFormData({ ...formData, bed_num: e.target.value })
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
		bed_size_name:"" */}
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
                <label className="block mb-1 text-sm font-medium">Bed Size Name</label>
                <input
                      type="text"
                      name="bed_size_name"
                      value={formData.bed_size_name}
                      onChange={(e) =>
                        setFormData({ ...formData, bed_size_name: e.target.value })
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

export default BedsDeactivate