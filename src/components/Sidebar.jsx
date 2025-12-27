
import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, BookImageIcon, HomeIcon, BedIcon, LogOut, Tags  } from 'lucide-react'
import { FaHome, FaUser, FaCog, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import React, { useState, useContext, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
const SIDEBAR_ITEMS = [
// {name:"Overview", icon: BarChart2, color:"#6366f1", href:'/'},
{
    name:"Bookings", icon: ShoppingBag, color:"#99746f1", href:'/bookings', allowed: ["SUPER_ADMIN", "MANAGER", "RECEPTION"] 
},
{
    name:"Rooms", icon: MdMeetingRoom, color:"#6366f1", href:'/rooms', allowed: ["SUPER_ADMIN", "ADMIN", "MANAGER"] 
}
,
{
    name:"Beds", icon: BedIcon, color:"#6366f1", href:'/beds', allowed: ["SUPER_ADMIN", "ADMIN", "MANAGER"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
{
    name:"Users", icon: Users, color:"#6366f1", href:'/users', allowed: ["SUPER_ADMIN", "ADMIN", "MANAGER"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
{
    name:"Promo", icon: Tags, color:"#6366f1", href:'/promo', allowed: ["SUPER_ADMIN", "MANAGER"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
{
    name:"Checkins", icon: DollarSign, color:"#6366f1", href:'/checkins', allowed: ["SUPER_ADMIN", "MANAGER", "RECEPTION" ] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
{
    name:"Payments", icon: ShoppingCart, color:"#6366f1", href:'/payments', allowed: ["SUPER_ADMIN", "MANAGER", "RECEPTION"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
{
    name:"Invoices", icon: ShoppingCart, color:"#6366f1", href:'/invoices', allowed: ["SUPER_ADMIN", "MANAGER", "RECEPTION"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
},
// {
//     name:"Analytics", icon: TrendingUp, color:"#6366f1", href:'analytics'
// },
{
    name:"Settings", icon: Settings, color:"#6366f1", href:'/settings', allowed: ["SUPER_ADMIN", "ADMIN", "MANAGER", "RECEPTION"] //SUPER_ADMIN, ADMIN, RECEPTION, MANAGER, CUSTOMER
}
// {
//     name: "User Settings",
//     icon: <FaUser />, 
//     // submenu: [
//     //   { name: "Profile", href: "/profile" },
//     //   { name: "Account", href: "/account" },
//     // ],
//     color:"#6366f1",
//     href:'/userSettings'
//   }

]

function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { logout } = useContext(AuthContext);
    const [role, setRole] = useState(null)
      useEffect(()=>{
        handleRole()
      })
      const handleRole=()=>{
        const userObj = sessionStorage.getItem('user');
            if(!userObj) return;
            const user = JSON.parse(userObj);
            setRole(user.role)
      }
    return (
        <motion.div
        className={`relative z-10 transition-all duration-30 ease-in-out flex-shrink-0 ${isSidebarOpen? 'w-64':'w-20'}`}
        animate={{width : isSidebarOpen? 256:80}}>
            <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={()=> setIsSidebarOpen(!isSidebarOpen)}
                className='p2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'>
                    <Menu size={24}></Menu>

                </motion.button>
                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS.map((item, index)=>(
                       <>
                        {(role && item.allowed.includes(role)) &&
                        <Link key={item.href} to={item.href}>
                            <motion.div
                            className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{color:item.color, minWidth: "20px"}} ></item.icon>
                                <AnimatePresence>
                                    {isSidebarOpen && 
                                    (<motion.span
                                    className='ml-4 whitespace-nowrap'
                                    initial={{opacity: 0, width: 0}}
                                    animate={{opacity: 7, width:"auto"}}
                                    exit={{opacity: 0, width:0}}
                                    transition={{duration:0.2, delay:0.1}}
                                        >
                                        {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>}</> 
                    ))}
                    
                    <Link key={'/logout'} to={'/logout'}>
                        <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                            <LogOut size={20} style={{color:"#6366f1", minWidth: "20px"}} ></LogOut>
                            <AnimatePresence>
                                {isSidebarOpen && 
                                (<motion.span
                                className='ml-4 whitespace-nowrap'
                                initial={{opacity: 0, width: 0}}
                                animate={{opacity: 7, width:"auto"}}
                                exit={{opacity: 0, width:0}}
                                transition={{duration:0.2, delay:0.1}}
                                    >
                                    {"Logout"}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                </nav>
            </div>

        </motion.div>
    )
}

export default Sidebar