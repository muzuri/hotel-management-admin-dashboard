import React, { useEffect, useState, useMemo } from 'react'
import { Search, Settings, Plus} from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import { MdMeetingRoom } from "react-icons/md";
import {motion} from 'framer-motion'
import { Eye } from 'lucide-react';
import axios from 'axios';
import { debounce } from "lodash";
import UserRoom from './UserRoom';
import LoadingRing from '../common/LoadingRing';

const RoomTable = ({updateMessage,bookedRom }) => {
    // State to hold the data, loading status, and any errors
    const [rooms, setRoom] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [filtered, setFiltered] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Store filtered data
    const [isDelete, setIsDelete] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const[open, setOpen]= useState(false);
    const [register, setRegister] = useState(false);
    const [buttons] = useState([
      {
        id: 1,
        label: "Add new Room",
        disabled: false,
        icon: <IoAddCircle size={18}/>,
        onClick: ()=> updateMessage("newRoom"),
      },
      {
        id: 2,
        label: "Booked Rooms",
        disabled: false,
        icon: <MdMeetingRoom/>,
        onClick:() => updateMessage("bookedRooms"),
      },
      {
        id: 3,
        label: "Available Rooms",
        icon: <MdMeetingRoom size={25} />,
        disabled: false,
        onClick: () => {
          updateMessage("availableRooms")
        },
      }
    ]);
    // Fetch data when the component mounts
  useEffect(() => {
    // Define the URL of the API
    const url = 'http://localhost:8080/hotel/room';
    // Fetch data
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRoom(data);  // Store the fetched data
        setLoading(false);  // Set loading to false once the data is fetched
      })
      .catch((error) => {
        setError(error.message);  // Store any error that occurs during the fetch
        setLoading(false);  // Set loading to false if an error occurs
        
      });
  }, []);  // Empty dependency array means it runs once when the component mounts
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = rooms.filter(
        (room) => room.room_category.toLowerCase().includes(term) || room.room_desc.toLowerCase().includes(term)

    );
    setRoom(filtered);
    setLoading(false)
};
  // Delete Function
  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Room with Room Number ${roomId}?`);
    if(confirmDelete){
    if (!roomId) return;

    try {
      await fetch(`http://localhost:8080/hotel/room/${roomId}`, {
        method: "DELETE",
      });

      // Update State After Deletion
    setRoom(rooms.filter((item)=> item.id !== roomId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }};
const clickEdit =()=>{
    updateMessage("editRoom")
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
						placeholder='Search room...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
        </div>
        {selectedRow && (
          <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">{`Information about ${selectedRow.room_desc}`}</h3>
          <p><strong>Room Description:</strong> {selectedRow.room_desc}</p>
          <p><strong>Price:</strong> {selectedRow.price}</p>
          <button
            onClick={() => setSelectedRow(null)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
          </div>
        
      )}

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room Number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Floor No
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
              Room Category
							</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Beds
							</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								View
							</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Actions
							</th>
                            
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{rooms.map((room) => (
							<motion.tr
              className=' hover:bg-amber-950'
								key={room.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}

							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{room.id}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{room.floorNo}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{room.room_category}
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{room.number_bed}
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{room.view}
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                   {room.currency}
                </td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={clickEdit}>Edit</button>
                                    <button className="btn btn-secondary"></button>
									<button className='text-red-400 hover:text-red-300 mr-4' onClick={() => handleDelete(room.id)}>Delete</button>
                  <button className='text-red-400 hover:text-red-600' onClick={()=> setSelectedRow(room)}>View</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
  )
}

export default RoomTable