import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import Header from '../common/Header';
import { Edit, Search, Trash2 } from "lucide-react";
import AlertMessage from '../common/AlertMessage';
import WarningMessage from '../common/WarningMessage';

const BookedBeds = ({updateMessage}) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [checkinDate, setCheckinDate] = useState();
    const [checkoutDate, setCheckoutDate] = useState();
    const [selectedRow, setSelectedRow] = useState(null);
    const [search, setSearch] = useState(null);
    const [todayDate, setToday] = useState('');
    const [tomorrowDate, setTomorrow] = useState('');
    const [error, setError] = useState(null);
    const [filterCheckin, setFilterCheckin] = useState(null);
    const [filterCheckout, setFilterCheckout] = useState(null)
    const [bedDetails, setBedDetails ] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [adults, setAdults] = useState(1);
    const [minors, setMinors] = useState(0);
    const [numRooms, setNumRooms] = useState(1);
    


  // Optional: Handle error message

    
//   useEffect(() => {
//     const initialDate = new Date();
//     const todayDate = new Date();
//     todayDate.setDate(initialDate.getDate() + 1)
// const tomorrowDate = new Date();
// tomorrowDate.setDate(initialDate.getDate() + 2);

// const formatDate = (date) => {
//   return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
// };

// setCheckinDate(formatDate(todayDate));
// setCheckoutDate(formatDate(tomorrowDate));
//   }, [])
    useEffect(() => {

    // console.log(todayDate);
    // console.log(tomorrowDate)
        // Fetch data from API
        const  fetchData = async() => {
        const response = await fetch('https://xenonhostel.com/hotel/room/status', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              "adult": adults,
              "minor": minors,
              "in": filterCheckin,
              "out": filterCheckout,
              "num_of_rooms":numRooms
          })
      })
      if (!response.ok) {
          setError('Failed to submit the data. Please try again.')
      }
      const data = await response.json();
      const avai = availableBeds(data);
      console.log('------------ Booked are this ');
      console.log(avai);
      console.log(data)
      setData(data);
      setFilteredData(data);
        }
        fetchData();
      }, [filterCheckin, filterCheckout]);
  const isInvalidRange = filterCheckin && filterCheckout && filterCheckin >= filterCheckout;
  const today = new Date().toISOString().split('T')[0];

  const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  const availableBeds = (data) => {
   return  data.map((bedAvailable) => bedAvailable.beds.filter((bed) => bed.status==='BOOKED'))
  }

  const handleRowsChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page on change
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <motion.div
    className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
> 
    <Header title={'Booked Beds'}></Header>
    <div>
        {isInvalidRange && <WarningMessage message={'Checkin-date should be less than Checkout Date'}></WarningMessage>}
    </div>
    <div className="flex flex-col md:flex-row gap-4 mb-4">
    <label>Checkin-Date</label>
        <input
          type="date"
          className="p-2 border rounded-md w-full md:w-1/4 bg-amber-200 text-black"
          value={filterCheckin}
          min={today}
          onChange={(e) =>{ setFilterCheckin(e.target.value);
            // Reset checkout if it's earlier than new check-in
            if (filterCheckout && e.target.value >= filterCheckout) {
                setFilterCheckout(addDays(filterCheckin, 1));
              }
          }
            
          }
        />
        <label>Checkout-Date</label> 
        <input
          type="date"
          className="p-2 border rounded-md w-full md:w-1/4 bg-amber-200 text-black"
          value={filterCheckout}
          onChange={(e) => setFilterCheckout(e.target.value)}
          disabled={!filterCheckin}
          min={today | filterCheckin}
        />
        <input
          type="text"
          placeholder="Search by name.."
          className='bg-gray-700 text-white placeholder-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    {/* <div>
    {selectedRow && (
          <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">{`Information about Bed  ${selectedRow.bed_num}`}</h3>
          {console.log(selectedRow.length)}
          <p><strong>Bed Size Name :</strong> {selectedRow.status}</p>
          <p><strong>Price:</strong> {selectedRow.price}</p>
          <button
            onClick={() => setSelectedRow(null)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close
          </button>
          </div>
        
      )}
    </div> */}
    <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    
    <div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room Number
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booked Bed Details
							</th>
                            {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th> */}
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>		
          {data.length > 0 ? (
          data.map((bed) => (
			<motion.tr
				key={bed.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{bed.id}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                        {/* Available Beds Details in a Room */}
                <td className="p-4 border-t">
                {bed.beds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {bed.beds.filter(bedAvailable => bedAvailable.status === "BOOKED")
                    
                    .map((bedAvailable, i) => (
                      
                      <div
                        key={i}
                        className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm`}
                       
                      >
                        {/* <p>Bed Number: {hobby.bed_num} Bed Type: {hobby.bed_size_name}</p><br></br> */}
                        <div className="mb-2">
                        <h2 className="text-amber-50 text-base mb-4">Bed Details</h2>
                        {/* {console.log('Number of available Beds'+bed.beds.length)} */}
        {bedAvailable.bed_num && <p onClick={() => selectedRow(bedAvailable)} className="text-sm text-blue-50">{bedAvailable.bed_num}</p>}
      </div>
     
      {bedAvailable.bed_size_name && <div className="text-sm text-blue-50">{bedAvailable.bed_size_name}</div>}
      {bedAvailable.size && <div className="text-sm text-blue-50">{bedAvailable.size}</div>}
    
                        
                      </div>
                    ))}
                  </div>
                  ):(
                  <div>
                    <p className=''>The Room is empty</p>
                  </div>)}
                </td>
                </td>
                
            {/* I think we do not need to view details from Beds Available what we have is enough  */}
             {/* {bed.beds.map((hobby, i) => (
                      <button
                        key={i}
                        className='text-green-600 hover:text-red-600' onClick={()=> setSelectedRow(hobby)}
                      >
                       View Dedails
                      </button>
                      
                    ))} */}
                {/* <button className='text-red-400 hover:text-red-600' onClick={()=> setSelectedRow(bed)}>View</button> */}
				
			</motion.tr>

            
		))
        
          )
           : (
            <tr>
              <td colSpan="3" className="text-center p-4">{`Today is ${todayDate} and Tommorow is ${tomorrowDate} `}</td>
            </tr>
          )}
        </tbody>
				</table>
			</div>
            {/* <div>
            <button className='text-red-400 hover:text-red-600' onClick={()=> backAllBedList}>Bed List</button>
            </div> */}


      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="space-x-1">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {number + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>


    </motion.div>
  )
}

export default BookedBeds