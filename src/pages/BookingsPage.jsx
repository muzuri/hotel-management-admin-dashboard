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
        <Header title= "Bookings"/>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* STAT */}
    
          {/* BOOKING TABLE */}
          <BookingsTable></BookingsTable>

          {/* CHARTS */}
          {/* <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
            <SalesTrendCharts></SalesTrendCharts>
            <CategoryDistributionCharts></CategoryDistributionCharts>
          </div> */}
        </main>
    </div>
    )
}

export default BookingsPage