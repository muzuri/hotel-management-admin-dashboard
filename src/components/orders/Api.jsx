import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { Eye } from 'lucide-react';
const api1 = 'https://jsonplaceholder.typicode.com/albums/'

const Api = () => {
    // State to hold the data, loading status, and any errors
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch data when the component mounts
  useEffect(() => {
    // Define the URL of the API
    const url = 'http://localhost:8080/hotel/room'

    // Fetch data
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);  // Store the fetched data
        setLoading(false);  // Set loading to false once the data is fetched
      })
      .catch((error) => {
        setError(error.message);  // Store any error that occurs during the fetch
        setLoading(false);  // Set loading to false if an error occurs
      });
  }, []);  // Empty dependency array means it runs once when the component mounts

  // Render loading, error, or data depending on the state
  if (loading) {
    return <div>Loading...</div>;
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
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Order List</h2>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room Number
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room Category
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Room Description
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Created Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Actions
							</th>
                            
						</tr>
					</thead>
                    {/* //         {photos.map((photo) => (
    //             <img key={photo.id} src={photo.url} alt={photo.title} width={100} />
    //             ))} */}

					<tbody className='divide divide-gray-700'>
						{data.map((order) => (
							<motion.tr
								key={order.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order.id}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order.room_category}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order.room_desc}
								</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order.room_desc}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
										<Eye size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
  )
}

export default Api