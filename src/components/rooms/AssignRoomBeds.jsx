import React, {useState, useEffect} from 'react'
import { Search, Settings, Plus} from "lucide-react";
import {motion} from 'framer-motion'
import LoadingRing from '../common/LoadingRing';
import BedRegister from '../Beds/BedRegister';
const AssignRoomBeds = () => {
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
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("No token found");
            return;
        }
        // Define the URL of the API
        const url = `${import.meta.env.VITE_API_BASE_URL}/hotel/room`;
        // Fetch data
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${JSON.parse(token)}`,
                "Content-Type": "application/json"
            }})
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
    const handleSelectedId = (id) => {
        console.log(id);
        setSelectedId(id)
        // updateMessage("newBed")
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
{selectedId ? <BedRegister room_id={selectedId} updateMessage={"newBed"}></BedRegister>:

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
                            <button className='text-red-400 hover:text-red-300 mr-4' onClick={() => handleSelectedId(room.id)}>Choose Room</button>
                            {/* {selectedId !== null && <BedRegister room_id={selectedId}></BedRegister>} */}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>
}

</motion.div>
  )
}

export default AssignRoomBeds