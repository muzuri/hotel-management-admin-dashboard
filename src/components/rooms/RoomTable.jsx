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
    const[selectedRoom, setSelectedRoom] = useState(null);
    const[showRoomsTable, setShowRoomsTable]= useState(true);
    const [register, setRegister] = useState(false);
    const [editRowId, setEditRow] = useState(null);
    const[showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
      size: "",
      bed_size: "",
      floorNo: "",
      number_bed: "",
      room_category: "",
      view:"",
      price:"",
      currency:"",
      room_desc:"",
      room_num:"",
      branch_id:1
    });
    const [buttons] = useState([
      {
        id: 1,
        label: "Add new Room",
        disabled: false,
        icon: <IoAddCircle size={18}/>,
        onClick: ()=> updateMessage("newRoom"),
      },
     // This will be used again in Case we will need more Functionalities in Rooms 
     // so far there is no need.

      // {
      
      //   id: 2,
      //   label: "Booked Rooms",
      //   disabled: false,
      //   icon: <MdMeetingRoom/>,
      //   onClick:() => updateMessage("bookedRooms"),
      // },
      // {
      //   id: 3,
      //   label: "Available Rooms",
      //   icon: <MdMeetingRoom size={25} />,
      //   disabled: false,
      //   onClick: () => {
      //     updateMessage("availableRooms")
      //   },
      // }
    ]);
    // Fetch data when the component mounts
  useEffect(() => {
    // Define the URL of the API
    const url = 'https://api.xenonhostel.com/hotel/room';
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
      await fetch(`https://api.xenonhostel.com/hotel/room/${roomId}`, {
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
const handleView = (room) => {
  setSelectedRow(room);
  setShowRoomsTable(false);
}

const handleUpdate = async () => {
  try {
    await axios.put(
      `https://api.xenonhostel.com/hotel/room/${selectedRoom.id}`,
      formData
    );

    const newData = rooms.map((u) =>
      u.id === selectedRoom.id ? { ...u, ...formData } : u
    );
    setRoom(newData);
    closeModal();
  } catch (err) {
    console.error("Update error:", err);
  }
};
const closeModal = () => {
  setSelectedRoom(null);
  setFormData(
    {
      id:"",
      size: "",
      bed_size: "",
      floorNo: "",
      number_bed: "",
      room_category: "",
      view:"",
      price:"",
      currency:"",
      room_desc:"",
      room_num:"",
      branch_id:1
    }
  );
  setShowModal(false);
  setShowRoomsTable(true);
};
const openEditModal = (row) => {
  setSelectedRoom(row);
  setFormData(
    {
      id:row.id,
      size: row.size,
      bed_size: row.bed_size,
      floorNo: row.floorNo,
      number_bed: row.number_bed,
      room_category: row.room_category,
      view:row.view,
      price:row.price,
      currency:row.currency,
      room_desc:row.room_desc,
      branch_id:row.branch_id,
      room_num:row.room_num
    }
  );
  setShowModal(true);
  setShowRoomsTable(false)
};
const handleClose= () => {
  setSelectedRow(null);
  setShowRoomsTable(true);
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
            onClick={handleClose}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
          </div>
        
      )}

    
			<div className='overflow-x-auto'>
      {showRoomsTable && 
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room id
							</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room Number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
							Room Description
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
              Room Category
							</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Number Beds
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
                    {room.room_num}
									
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {room.room_desc}
							
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {room.room_category}
							
								</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                    {room.number_bed}
							
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>                 
                  <button
                    onClick={() => openEditModal(room)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button className='text-red-400 hover:text-red-300 mr-4' 
                  onClick={() => handleDelete(room.id)}>Delete</button>
                  <button className='bg-amber-300 text-blue-700 hover:text-cyan-700' onClick={()=> handleView(room)}>View</button>
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
            <h3 className="text-lg font-bold mb-4">Edit Room</h3>
            <div className="space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Room Number</label>
                <input
                      type="text"
                      name="room_num"
                      value={formData.room_num}
                      onChange={(e) =>
                        setFormData({ ...formData, room_num: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Room Size</label>
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
                <label className="block mb-1 text-sm font-medium">Room Category</label>
                <input
                      type="text"
                      name="room_category"
                      value={formData.room_category}
                      onChange={(e) =>
                        setFormData({ ...formData, room_category: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Room Description</label>
                <input
                      type="text"
                      name="room_desc"
                      value={formData.room_desc}
                      onChange={(e) =>
                        setFormData({ ...formData, room_desc: e.target.value })
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

export default RoomTable