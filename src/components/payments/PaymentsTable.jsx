import React from 'react'
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Check, X } from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Buttons from '../common/Buttons';
import LoadingRing from '../common/LoadingRing';

const PaymentsTable = ({updateMessage}) => {
    const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [payment_method, setPaymentMethod] = useState(""); // Search input state
	const [other, setOther] = useState(""); // Search input state
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
	const [selectedRow, setSelectedRow] = useState(null);
    const[selectedPayment, setSelectedPayment] = useState(null);
    const[showPaymentsTable, setShowPaymentsTable]= useState(true);
	const[showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		amount: "",
		exchange_rate: "",
		net_mount: "",
		payment_fee: "",
		booking_id: "",
		id: "",
		payment_method: "",
		payment_status: "",
		tax: ""
	  });
// 	const [viewStack, setViewStack] = useState(["ListPayments"]);
//     const currentView = viewStack[viewStack.length-1];
//     const goTo = (view) => setViewStack((prev) => [...prev, view]);
//     const goBack = () => {
//     if (viewStack.length > 1) {
//       setViewStack((prev) => prev.slice(0, -1));
//     }
//   };
	useEffect(() => {
	  // Fetch data from API
	  const url = `${import.meta.env.VITE_API_BASE_URL}/hotel/payment`
	  const fetchData = async () => {
		try {
			const token = sessionStorage.getItem('token');
			if(!token) return;
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${JSON.parse(token)}`,
					"Content-Type": "application/json",  // if you're sending JSON
				}
			});
			const result = await response.json();
			console.log(result);
			setData(result);
			setFilteredData(result); // Initialize filteredData with full data
			console.log("Payments status is" + result)
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
		setSelectedPayment(null);
		setFormData(
		  {
			amount: "",
			exchange_rate: "",
			net_mount: "",
			payment_fee: "",
			booking_id: "",
			id: "",
			payment_method: "",
			payment_status: "",
			tax: ""
		  }
		);
		setShowModal(false);
		setShowPaymentsTable(true);
	  };
	   // Delete Function
  const handleDelete = async (bedId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!bedId) return;
    try {
		const token = sessionStorage.getItem('token')
		if(!token) return;
		await fetch(`${import.meta.env.VITE_API_BASE_URL}/hotel/bed/${bedId}`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${JSON.parse(token)}`,
				"Content-Type": "application/json",  // if you're sending JSON
			}
		});

      // Update State After Deletion
    setData(data.filter((item)=> item.id !== bedId))
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleChangeStatus = async(bedId) => {
	try{
		const token = sessionStorage.getItem('token')
		if(!token) return;
		await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/hotel/bed/${bedId}`,{
				method:"POST",
				headers: {
					"Authorization": `Bearer ${JSON.parse(token)}`,
					"Content-Type": "application/json",  // if you're sending JSON
				}
			});
			   // Update State After Deletion
		setData(data.filter((item)=> item.id !== bedId))

	}
	catch(error) {
		console.error("Error in activating bed status:", error);
	}
  }
	const handleUpdate = async () => {
		try {
			const token = sessionStorage.getItem('token');
			if(!token) return;
			await axios.put(
			`${import.meta.env.VITE_API_BASE_URL}/hotel/payment/${selectedPayment.id}`,
			{
				"payment_method": payment_method === "OTHER" ? other : payment_method,
				"payment_status": "SUC"
			},{
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${JSON.parse(token)}`
				}
			}
		);
	
		const newData = filteredData.map((u) =>
			u.id === selectedPayment.id ? { ...u, ...formData } : u
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
		setSelectedPayment(row);
		console.log(row);
		setFormData(
		  {
		amount: row.amount,
		exchange_rate: row.exchange_rate,
		net_mount: row.net_mount,
		payment_fee: row.payment_fee,
		booking_id: row.booking_id,
		id: row.id,
		payment_method: row.payment_method,
		payment_status: row.payment_status,
		tax: row.tax
		  }
		);
		setShowModal(true);
		setShowPaymentsTable(false)
	  };
	//   const openEdit = ()=> {
	// 	setShowModal(true)
	// 	setShowPaymentsTable(false)
	//   }
	  const handleClose= () => {
		setSelectedRow(null);
		setShowPaymentsTable(true);
	  }
	  
		// Render loading, error, or data depending on the state
		if (isLoading) {
		  return <LoadingRing></LoadingRing>
		}
	  
		// if (error) {
		//   return <div>Error: {error}</div>;
		// }
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}>
			<div className='flex justify-between items-center mb-6'>
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
            <h2 className='text-xl font-semibold text-gray-100 text-center'>Active Payments in Hotel</h2>
			<div className='overflow-x-auto'>
				{showPaymentsTable &&
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
                        	<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Payment Id</th>
        
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Exchange rate
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Net Amount
							</th>
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed number
							</th> */}
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Payment fee
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Currency
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Amount
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								payment method
							</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								tax
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
					<tbody className='divide-y divide-gray-700'> {filteredData.length > 0 ? (filteredData.map((payment) => (
						<motion.tr
							key={payment.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								{payment.id}
							</td>
							{/* <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
								<img
									src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
									alt='Product img'
									className='size-10 rounded-full'
								/>
								{payment.created_by}
							</td> */}
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.exchange_rate}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.net_mount}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.payment_fee}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.currency}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.amount}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.payment_method}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.tax}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{payment.payment_status ==='SUC' ? "Success":
							payment.payment_status ==='ENT' ? "Initiated" : payment.payment_status ==='PEN' ? "Pending" : "Requested"}</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
							<button className='text-red-400 hover:text-red-300' onClick={() => handleChangeStatus(payment.id)}>
									<X size={18} />
								</button>
								{payment.payment_status !== 'SUC' &&
								<><button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={()=> openEditModal(payment)}>
									<Edit size={18} />
								</button>
								<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(payment.id)}>
									<Trash2 size={18} />
								</button></>}
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
            <h3 className="text-lg font-bold mb-4">Edit Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Bookining ID</label>
                <input
                      type="text"
                      name="size"
                      value={formData.booking_id}
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Amount</label>
                <input
					type="text"
					name="bed_num"
					value={formData.amount}
					onChange={(e) =>
						setFormData({ ...formData, bed_num: e.target.value })
					}
					className="border p-2 w-full rounded"
                    />
              </div>
			
              <div>
                <label className="block mb-1 text-sm font-medium">Tax</label>
                <input
                      type="text"
                      name="currency"
                      value={formData.tax}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <input
                      type="text"
                      name="status"
					//   readOnly={true}
                      value={formData.payment_status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Payment channel</label>
                <select
                      type="text"
                      name="matt_size"
                      value={payment_method}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="border p-2 w-full rounded">
					<option selected>Open this select menu</option>
					<option value="CASH">CASH</option>
					<option value="POS">POS</option>
					<option value="OTHER">Other channels</option>
				</select>
              </div>
			  {payment_method === 'OTHER' &&
			  <div>
                <label className="block mb-1 text-sm font-medium">Other channel</label>
                <input
                      type="text"
                      name="other"
					//   readOnly={true}
                      value={other}
                      onChange={(e) =>
                        setOther(e.target.value)
                      }
                      className="border p-2 w-full rounded"
                    />
              </div>
			  }
              
              
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

export default PaymentsTable