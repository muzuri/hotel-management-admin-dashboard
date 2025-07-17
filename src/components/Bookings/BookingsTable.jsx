import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import StatCard from "../common/StatCard";
import { Package,TrendingUp, AlertTriangle,DollarSign, EuroIcon } from 'lucide-react'

const BookingsTable = () => {
	const [isLoading, setIsLoading] = useState(true);
	
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [reference, setReference] = useState("");
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [totalAmount, setTotalAmount] = useState(0);
	const [totalBooking, setTotalBooking] = useState(0);
  
	useEffect(() => {
		// Fetch data from API
		const url = 'https://api.xenonhostel.com/hotel/booking'
		const fetchData = async () => {
		  try {
			const response = await fetch(url);
			const result = await response.json();
			setData(result);
			setFilteredData(result); // Initialize filteredData with full data
			console.log('filtered data ....')
		    console.log(filteredData);
		  } catch (error) {
			console.error("Error fetching data:", error);
		  }
		};
		fetchData();
		totalRevenue(filteredData);
		console.log('total revenue ........')
		console.log(totalRevenue)
		setTotalBooking(filteredData.length)
		
	  }, []);
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.reference.toLowerCase().includes(reference.toLowerCase())
	  );
	  setFilteredData(filtered);
	  totalRevenue(filtered)
	  setTotalBooking(filteredData.length)
	}, [reference, data]);
	useEffect(()=> {
		const filtered = data.filter((item) => {
			const itemDate = new Date(item.booking_date);
			const from = startDate ? new Date(startDate) : null;
			const to = endDate ? new Date(endDate) : null;
	  
			return (!from || itemDate >= from) && (!to || itemDate <= to);
		  });
	  
		  setFilteredData(filtered);
		  totalRevenue(filteredData)
		  setTotalBooking(filteredData.length)
	},[startDate, endDate, data])

	const downloadBooking = (data) => {
		const flattened = data.flatMap((booking) =>
			booking.booked_beds.map((bed) => ({
			  BookingName: booking.booking_name,
			  Reference: booking.reference,
			  booking_date: booking.booking_date,
			  "Checkin-Date": bed.checking_in_date,
			  "Checking-out-date": bed.checking_out_date,
			  "Payment Amount": booking.payment.amount,
			  "Payment Status": booking.payment.payment_status,
			  "Payment Currency": booking.payment.currency
			}))
		  );

		const worksheet = XLSX.utils.json_to_sheet(flattened);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, "table_data.xlsx");
	}
	const totalRevenue = (data) =>{
		const total = data.reduce((sum, item)=> sum + 0, 0);
		setTotalAmount(total.toFixed(2));
	}
	// const totalRevenue = (data) =>{
	// 	const total = data.reduce((sum, item)=> sum + item.payment.amount, 0);
	// 	setTotalAmount(total.toFixed(2));
	// }

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			      <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-4 lg:grid-cols-2 mb-8'
          initial={{opacity: 0, y: 200}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
          >
          <StatCard name='Total Booking' icon={Package} value={totalBooking} color='#6366F1' />
					{/* <StatCard name='Top Selling Room' icon={TrendingUp} value={89} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={23} color='#F59E0B' /> */}
					<StatCard name='Total Revenue' icon={EuroIcon} value={`${totalAmount}`} color='#EF4444' />
          </motion.div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Bookings</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search by Reference number...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={reference}
						onChange={(e) => setReference(e.target.value)}
						
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
				<div>
				<button onClick={() => downloadBooking(filteredData)}
				className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Generate Report</button>
				</div>
				<div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full border px-2 py-1 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full border px-2 py-1 rounded-md"
          />
        </div>
      </div>
			</div>


			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
							    #
							</th>
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
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bookingId+1}</td>
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
	{/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
						<Edit size={18} />
					</button>
					<button className='text-red-400 hover:text-red-300'>
						<Trash2 size={18} />
					</button>
				</td> */}
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