import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const BOOKING_DATA = [
	{ id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720 },
];

const BookingsTable = () => {
	const [isLoading, setIsLoading] = useState(true);
	
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
  
	useEffect(() => {
	  // Fetch data from API
	  const  fetchData = async() => {
	  const response = await fetch('http://localhost:8080/hotel/room/available', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"adult": 2,
			"minor": 0,
			"in": "2025-04-12",
			"out": "2025-04-14"
		})
	})
	if (!response.ok) {
		setError('Failed to submit the data. Please try again.')
	}
	const data = await response.json()
	const rooms = data.map((room) => {
		return {...room, beds: room.beds.filter((bed) => bed.status === 'AVAILABLE')}
	  })
	console.log('-------====>', rooms)
	setData(rooms);
	  }
	  fetchData();
	}, []);
  
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.room_category.toLowerCase().includes(search.toLowerCase())
	  );
	  setFilteredData(filtered);
	}, [search, data]);
  

	// const handleSearch = (e) => {
	// 	const term = e.target.value.toLowerCase();
	// 	setSearchTerm(term);
	// 	const filtered = data.filter(
	// 		(booking) => booking.name.toLowerCase().includes(term) || booking.category.toLowerCase().includes(term)
	// 	);

	// 	setFilteredProducts(filtered);
	// };

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Booked Room List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search Room...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						// onChange={(e) => setSearch(e.target.value)}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			{/* "id": 4,
    "created_by": "postgres",
    "updated_by": null,
    "created_at": "2025-03-15T21:57:06.995246",
    "updated_at": null,
    "size": null,
    "bed_size": null,
    "has_balcony": false,
    "floorNo": 2,
    "number_bed": 1,
    "room_category": "Deluxe double room",
    "view": "Swimming pool",
    "currency": "USD", */}

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room Categories
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room View
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Payment Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkin_Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkout_Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkout
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
					
          {filteredData.length > 0 ? (
           filteredData.map((product) => (
			<motion.tr
				key={product.id}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
					<img
						src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
						alt='Product img'
						className='size-10 rounded-full'
					/>
					{product.room_category}
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					{product.price}
				</td>

				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					${product.checking_in_date}
				</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.booking_name}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.booking_name}</td>
				<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
					<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
						<Edit size={18} />
					</button>
					<button className='text-red-400 hover:text-red-300'>
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
		</motion.div>
	);
};
export default BookingsTable;