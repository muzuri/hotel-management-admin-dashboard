import React from 'react'
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import { useState, useEffect } from "react";
import BedRegister from './BedRegister';

const BedsTable = ({updateMessage}) => {
    const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
    const [isListBed, setIsListBed] = useState(true);
    const [buttons] = useState([
        {
          id: 1,
          label: "Add Bed",
          disabled: false,
          icon: <IoAddCircle size={18}/>,
          onClick: ()=> {updateMessage("newBed")},
        },
        {
          id: 2,
          label: "Booked Bed",
          disabled: false,
          icon: <IoBed/>,
          onClick:() => updateMessage("bookedBed"),
        },
        {
          id: 3,
          label: "Available Bed",
          icon: <IoBed size={18} />,
          disabled: false,
          onClick: () => {
            updateMessage("availableBed")
          },
        }
      ]);
  
	useEffect(() => {
	  // Fetch data from API
	  const url = 'http://localhost:8080/hotel/bed'
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
	}, []);
      // Delete Function
  const handleDelete = async (bedId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!bedId) return;

    try {
      await fetch(`http://localhost:8080/hotel/bed/${bedId}`, {
        method: "DELETE",
      });

      // Update State After Deletion
    setData(data.filter((item)=> item.id !== bedId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.currency.toLowerCase().includes(search.toLowerCase())
	  );
	  setFilteredData(filtered);
	}, [search, data]);
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>


           
            <div>
			<div className='flex justify-between items-center mb-6'>
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
            <h2 className='text-xl font-semibold text-gray-100'>List of Bed in Hotel</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed Id
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Created By
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								created date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Size
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Price
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								 Bed Size Name
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                            Number of Person
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Mattles Size
							</th>
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
				<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
					<img
						src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
						alt='Product img'
						className='size-10 rounded-full'
					/>
					{bed.created_by}
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.created_at}
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.size}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.bed_num}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.currency}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.price}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.bed_size_name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.magnitude}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.matt_size}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bed.room_id}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
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
			</div>
            </div>
             
		</motion.div>
	);
}

export default BedsTable