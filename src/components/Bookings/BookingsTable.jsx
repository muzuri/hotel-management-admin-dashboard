import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const BookingsTable = () => {
	const [isLoading, setIsLoading] = useState(true);
	
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
  
	useEffect(() => {
		// Fetch data from API
		const url = 'http://localhost:8080/hotel/booking'
		const fetchData = async () => {
		  try {
			const response = await fetch(url);
			const result = await response.json();
			console.log(result);
			setData(result);
			console.log(result);
			setFilteredData(result); // Initialize filteredData with full data
		  } catch (error) {
			console.error("Error fetching data:", error);
		  }
		};
		fetchData();
	  }, []);
  
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.reference.toLowerCase().includes(search.toLowerCase())
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
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Bookings</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search by booking id ...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>


			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkin Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkout Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Reference ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Customer ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Amount Paid
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Method
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booked By
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking Date
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
					
          {filteredData.length > 0 ? (
           filteredData.map((booking, bookingId) =>
			booking.booked_beds.map((bed, bedId)=>
			(
			<motion.tr
				key={bookingId}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				{bedId === 0 && (
                  <>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                      {bed.bed_id}
                    </td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                      {bed.room_id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                      {bed.booking_id}
                    </td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                      {bed.checking_in_date}
                    </td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                      {bed.checking_out_date}
                    </td>
                  </>
                )}
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{booking.reference}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
					{booking.booking_name}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{booking.customer_id}
				</td>
			
	 <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.amount :'not yet payed'}</td> 
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.payment_method:'not payed'}</td>
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment? booking.payment.payment_status:'no pay method'}</td>
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment? booking.payment.currency:'no currency'}</td>
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment? booking.payment.payment_id:'no pay id'}</td> 
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.booked_by}</td>
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.booking_date}</td>
	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
						<Edit size={18} />
					</button>
					<button className='text-red-400 hover:text-red-300'>
						<Trash2 size={18} />
					</button>
				</td>
			</motion.tr>
		)))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">No data found</td>
            </tr>
          )}
        </tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default BookingsTable;