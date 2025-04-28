import React, { useEffect, useState, useMemo } from 'react'
import { Search, Settings, Plus} from "lucide-react";
import {motion} from 'framer-motion'

const Buttons = ({label, disabled= false, onClick, icon, key}) => {
  return (
    <div className='flex gap-4 p-6'>
    <motion.button
      key={key}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium shadow-md transition-all
        ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-indigo-600 text-white"}`}
    >
       {icon} 
      {label}
    </motion.button>
</div>
  )
}

export default Buttons