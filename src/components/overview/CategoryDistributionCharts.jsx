import React from 'react'
import {motion} from 'framer-motion'
import { Pie,PieChart, ResponsiveContainer, Tooltip,Cell, Legend } from 'recharts'
const categoryData = [
	{ name: "Single Room", value: 4500 },
	{ name: "Room with View", value: 3200 },
	{ name: "Small Room", value: 2800 },
	{ name: "Books", value: 2100 },
	{ name: "Sports & Outdoors", value: 1900 },
  { name: "VIP Room", value:5600}
  
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#fff12f"];

const CategoryDistributionCharts = () => {
  return (
    <motion.div 
    className='bg-gray-800 bg-opacity-100 backdrop-blur-md shadow-lg border-b border-gray-700'
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 1}}>
     <h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distributtion</h2>
     <div className='h-80'>
      <ResponsiveContainer
      height={'100%'}
      width={'100%'}>
        <PieChart>
          <Pie
          dataKey="value"
          data={categoryData}
          labelLine={false}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill='#8884d8'
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
          </Pie>
          <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31,43,78,0.8)',
            borderColor: '#4B55567S'}}
            itemStyle={{color: "#E5EZE"}}>
          </Tooltip>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>

     </div>
        
        </motion.div>
  )
}

export default CategoryDistributionCharts