import React, { useEffect, useState, useMemo } from 'react'
import { Search, Settings, Plus} from "lucide-react";
import {motion} from 'framer-motion'

const Buttons = (updateMessage) => {
    const [buttons] = useState([
        {
          id: 1,
          label: "Add new Room",
          disabled: false,
          icon: <Plus size={18}/>,
          onClick: ()=> updateMessage("no"),
        },
        {
          id: 2,
          label: "Booked Rooms",
          disabled: true,
          onClick:() => updateMessage("bookedRooms"),
        },
        {
          id: 3,
          label: "availableRooms",
          icon: <Settings size={18} />,
          disabled: false,
          onClick: () => {
            updateMessage("availableRooms")
          },
        }
      ]);
  return (
    <div className='flex gap-4 p-6'>
    {buttons.map((btn) => (
    <motion.button
      key={btn.id}
      whileTap={{ scale: 0.95 }}
      disabled={btn.disabled}
      onClick={btn.onClick}
      className={`flex items-center gap-2 py-2 px-4 rounded-lg font-medium shadow-md transition-all
        ${btn.disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-indigo-600 text-white"}`}
    >
      {btn.icon}
      {btn.label}
    </motion.button>
  ))}
</div>
  )
}

export default Buttons