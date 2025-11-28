import { motion } from "framer-motion";
import { Edit, Search, Trash2, View, TextIcon, FileDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import StatCard from "../common/StatCard";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Package,TrendingUp, AlertTriangle,DollarSign, EuroIcon } from 'lucide-react'

const BookingsTable = () => {
	const formatDate = (date) => {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	  };
	  const currentDate = new Date();
	  const startingDate = new Date();
	  
	  startingDate.setDate(currentDate.getDate() -5);
	const [isLoading, setIsLoading] = useState(true);
	
	const [data, setData] = useState([]); // Store API data
	const [search, setSearch] = useState(""); // Search input state
	const [reference, setReference] = useState("");
	const [filteredData, setFilteredData] = useState([]); // Store filtered data
	const [startDate, setStartDate] = useState(formatDate(startingDate));
	const [endDate, setEndDate] = useState(formatDate(currentDate));
	const [totalAmount, setTotalAmount] = useState(0);
	const [totalBooking, setTotalBooking] = useState(0);
  
	useEffect(() => {
		// Fetch data from API
		const token = sessionStorage.getItem('token');
		if(!token) return;
		const url = `${import.meta.env.VITE_API_BASE_URL}/hotel/booking`
		const fetchData = async () => {
		  try {
			const response = await fetch(url,{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${JSON.parse(token)}`,
					"Content-Type": "application/json",  // if you're sending JSON
				}
			});
			const result = await response.json();
			setData(result);
			setFilteredData(result); // Initialize filteredData with full data
			console.log('filtered data ....')
		    console.log(filteredData);
			totalRevenue(result);
			setTotalBooking(result.length);
		  } catch (error) {
			console.error("Error fetching data:", error);
		  }
		};
		fetchData();
	  }, []);
	useEffect(() => {
	  // Filter data based on search input
	  const filtered = data.filter((item) =>
		item.reference.toLowerCase().includes(reference.toLowerCase())
	  );
	  setFilteredData(filtered);
	  totalRevenue(filtered)
	  setTotalBooking(filtered.length)
	}, [reference, data]);
	useEffect(()=> {
		const filtered = data.filter((item) => {
			const itemDate = new Date(item.booking_date);
			const from = startDate ? new Date(startDate) : null;
			const to = endDate ? new Date(endDate) : null;
	  
			return (!from || itemDate >= from) && (!to || itemDate <= to);
		  });
	  
		  setFilteredData(filtered);
		  totalRevenue(filtered)
		  setTotalBooking(filtered.length)
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


// ...existing code...
const generateInvoice = async (booking) => {
  if (!booking) return;

  // helper - fetch image and convert to data URL
  const loadImageAsDataUrl = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Logo fetch failed");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // try to load JPEG logo (defaults to /logo.jpg)
  const logoPath = (import.meta && import.meta.env && import.meta.env.VITE_LOGO_PATH) || "/xenon_logo.jpg";
  let logoDataUrl = null;
  let logoFmt = "JPEG";
  try {
    logoDataUrl = await loadImageAsDataUrl(logoPath);
    // detect format from dataURL
    const mime = (logoDataUrl.split(",")[0].match(/data:(image\/[a-zA-Z+]+);base64/) || [])[1] || "image/jpeg";
    logoFmt = mime === "image/png" ? "PNG" : "JPEG";
    // place logo centered at the very top
    const logoW = 40; // max width
    const logoH = 20; // fixed height (keeps proportion reasonable)
    const logoX = (pageWidth - logoW) / 12;
    const logoY = 8;
    doc.addImage(logoDataUrl, logoFmt, logoX, logoY, logoW, logoH);
  } catch (e) {
    // ignore if logo not available
    logoDataUrl = null;
  }

  // helpers for content
  const safeRef = (booking.reference || booking.booking_name || Date.now()).toString().replace(/[^a-z0-9-_]/gi, "_");
  const formatCurrency = (amt, cur) => {
    const n = Number(amt || 0);
    return `${cur ? cur + " " : ""}${n.toFixed(2)}`;
  };
  const formatDisplayDate = (d) => {
    try {
      const date = new Date(d);
      return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  // header text (below the top logo if present)
  const headerStartY = logoDataUrl ? 40 : 20;
  const headerX = 14;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Xenon Hostel UG", headerX, headerStartY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Address Line 1", headerX, headerStartY + 6);
  doc.text("Address Line 2", headerX, headerStartY + 11);
  doc.text("Phone: (xxx) xxx-xxxx", headerX, headerStartY + 16);

  // invoice meta (right)
  doc.setFontSize(12);
  doc.text(`Invoice #: ${booking.reference || safeRef}`, pageWidth - 14, headerStartY, { align: "right" });
  doc.text(`Date: ${formatDisplayDate(new Date())}`, pageWidth - 14, headerStartY + 6, { align: "right" });

  // customer / booking block
  let startY = headerStartY + 32;
  doc.setFontSize(11);
  doc.text("Bill To:", 14, startY);
  doc.setFontSize(10);
  doc.text(`${booking.booking_name || "-"}`, 30, startY);
  if (booking.booked_by) doc.text(`${booking.booked_by}`, 14, startY + 12);
  if (booking.customer_id) doc.text(`Customer ID: ${booking.customer_id}`, 14, startY + 18);

  // booking/payment info block (right)
  const infoRightX = pageWidth - 14;
  doc.text(`Payment Status: ${booking.payment?.payment_status || "N/A"}`, infoRightX, startY + 6, { align: "right" });
  doc.text(`Method: ${booking.payment?.payment_method || "N/A"}`, infoRightX, startY + 12, { align: "right" });
  doc.text(`Total: ${formatCurrency(booking.payment?.amount, booking.payment?.currency)}`, infoRightX, startY + 18, { align: "right" });

  // table of booked beds using autoTable
  const tableStartY = startY + 28;
  const beds = (booking.booked_beds || []).map((bed, idx) => ([
    String(idx + 1),
    bed.bed_id || "-",
    bed.room_id || "-",
    formatDisplayDate(bed.checking_in_date),
    formatDisplayDate(bed.checking_out_date)
  ]));

  autoTable(doc, {
    head: [["#", "Bed ID", "Room ID", "Check-in", "Check-out"]],
    body: beds.length ? beds : [["-", "-", "-", "-", "-"]],
    startY: tableStartY,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [40, 116, 240] }
  });

  // totals and notes after table
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : tableStartY + 40;
  doc.setFontSize(11);
  doc.text("Notes:", 14, finalY);
  doc.setFontSize(10);
  // wrap long notes
  const notes = booking.notes || "Thank you for your business.";
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 28);
  doc.text(splitNotes, 14, finalY + 6);

  // totals on right
  doc.setFontSize(11);
  doc.text("Subtotal:", pageWidth - 60, finalY + 6, { align: "right" });
  doc.text(formatCurrency(booking.payment?.amount || 0, booking.payment?.currency), pageWidth - 14, finalY + 6, { align: "right" });

  // footer: page numbers + small logo bottom-left (JPEG supported)
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, logoFmt, 14, pageHeight - 20, 30, 10);
    }
    const footerText = `Page ${i} of ${pageCount}`;
    doc.setFontSize(9);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.setFontSize(9);
    doc.text("Xenon Hostel UG • contact@xenon.example", pageWidth - 14, pageHeight - 10, { align: "right" });
  }

  doc.save(`Invoice_${safeRef}.pdf`);
}
// ...existing code...



    const totalRevenue = (bookings) =>{
        // Sum booking.payment.amount for each booking (defensive parsing)
        const total = (bookings || []).reduce((sum, item) => {
            const amt = item && item.payment && item.payment.amount ? Number(item.payment.amount) : 0;
            return sum + (Number.isFinite(amt) ? amt : 0);
        }, 0);
        setTotalAmount(total.toFixed(2));
    }

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
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Bed ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Room ID
							</th> */}
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking ID
							</th> */}
							{/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkin Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Checkout Date
							</th> */}
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
								Payment ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booked By
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Booking Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Invoice
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
					
          {filteredData.length > 0 ? (
           filteredData.map((booking, bookingId) =>
			// booking.booked_beds.map((bed, bedId)=>
			(
				<motion.tr
					key={bookingId}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}>

					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{bookingId+1}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.reference}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>{booking.booking_name}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.customer_id}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.amount :'not yet payed'}</td> 
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.payment_method:'not payed'}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.payment_status:'no pay method'}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.currency:'no currency'}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.payment ? booking.payment.id:'no pay id'}</td> 
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.booked_by}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{booking.booking_date}</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
						<button className='text-blue-400 hover:text-blue-300' onClick={() => generateInvoice(booking)}>
							<FileDownIcon className='mr-2' size={18} />
						</button>
					</td>
					<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
						<button className='text-red-400 hover:text-red-300'>
							<View className='text-indigo-400 hover:text-indigo-300 mr-2' size={18} />
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