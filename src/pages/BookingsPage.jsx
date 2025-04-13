import React from 'react'
import {motion} from 'framer-motion'
import StatCard from '../components/common/StatCard'
import { Package,TrendingUp, AlertTriangle,DollarSign } from 'lucide-react'
import Header from '../components/common/Header'
import BookingsTable from '../components/Bookings/BookingsTable'
import CategoryDistributionCharts from '../components/overview/CategoryDistributionCharts'
import SalesTrendCharts from '../components/overview/SalesTrendCharts'


const BookingsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title= "Overview"></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* STAT */}
          <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{opacity: 0, y: 200}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
          >
          <StatCard name='Total Booked Room' icon={Package} value={1234} color='#6366F1' />
					<StatCard name='Top Selling Room' icon={TrendingUp} value={89} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={23} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$543,210"} color='#EF4444' />
          </motion.div>
          {/* BOOKING TABLE */}
          <BookingsTable></BookingsTable>

          {/* CHARTS */}
          <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
            <SalesTrendCharts></SalesTrendCharts>
            <CategoryDistributionCharts></CategoryDistributionCharts>
          </div>
        </main>
    </div>
    )
}

export default BookingsPage