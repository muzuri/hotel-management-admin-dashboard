import React from 'react'
import {motion} from 'framer-motion'
import { ResponsiveContainer, Legend, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const SALES_CHANNEL_DATA = [
	{ name: "Website", value: 45600 },
	{ name: "Mobile App", value: 38200 },
	{ name: "Marketplace", value: 29800 },
	{ name: "Social Media", value: 18700 },
];
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];
const SalesChannelCharts = () => {
  return (
    <motion.div className='bg-gray-800 bg-opacity-100 backdrop-blur-md shadow-lg border-b border-gray-700'
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 1}}>
     <h2 className='text-lg font-medium mb-4 text-gray-100 '>
        Sales Overview Charts
        </h2>
   <div className='h-80'>
    <ResponsiveContainer
    width={'100%'}
    height={'100%'}
    >
           <BarChart data={SALES_CHANNEL_DATA}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#4B5563'></CartesianGrid>
                    <XAxis dataKey={"name"} stroke='#9ca3af'></XAxis>
                    <YAxis stroke='#9ca3af'></YAxis>
                    <Tooltip
                    contentStyle={{
                        backgroundColor:"rgba(31,41,55,0.8)",
                        borderColor:"4B5563"
                    }}
                    itemStyle={{color: "#E5EZE"}}>
                        </Tooltip>
                        <Bar dataKey={'value'} fill='#88884d8'>
                        {SALES_CHANNEL_DATA.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
                        </Bar>

                </BarChart>
                <Legend></Legend>
    </ResponsiveContainer>
   </div>

    </motion.div>
  )
}

export default SalesChannelCharts