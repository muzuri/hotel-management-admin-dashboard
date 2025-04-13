import React from 'react'
import Header from './../components/common/Header'
import { motion } from 'framer-motion'
import StatCard from '../components/common/StatCard'
import { BarChart, BarChart2, ShoppingBag, Users, Zap } from 'lucide-react'
import SalesOverviewChart from '../components/overview/SalesOverviewChart'
import CategoryDistributionCharts from '../components/overview/CategoryDistributionCharts'
import SalesChannelCharts from '../components/overview/SalesChannelCharts'

const OverviewPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title= "Hotel Management"></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
          {/* STAT */}
          <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1}}
          >
            <StatCard name="Today's Income" icon={Zap} value='$12,889' color='#6366F1'/>
            <StatCard name="Today's Bookings" icon={Users} value='$12,889' color='#8B5CF6'/>
            <StatCard name="Total Products" icon={ShoppingBag} value='$12,889' color='#EC4899'/>
            <StatCard name="Conversion Rate" icon={BarChart2} value='$12,889' color='#10B981'/>
            <StatCard name="Room Available" icon={BarChart} value='$12,889' color='#10B981'/>
          </motion.div>

          {/* CHARTS */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <SalesOverviewChart/>
            <CategoryDistributionCharts/>
            <SalesChannelCharts/>

            

          </div>
        </main>
    </div>
  )
}

export default OverviewPage