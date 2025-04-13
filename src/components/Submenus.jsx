import { useState } from "react";
import { FaHome, FaUser, FaCog, FaChevronDown, FaChevronRight } from "react-icons/fa";

const Submenus = () => {
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (menu) => {
    setOpenSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/home" },
    {
      name: "User Settings",
      icon: <FaUser />, 
      submenu: [
        { name: "Profile", path: "/profile" },
        { name: "Account", path: "/account" },
      ],
    },
    {
      name: "Settings",
      icon: <FaCog />, 
      submenu: [
        { name: "General", path: "/settings/general" },
        { name: "Security", path: "/settings/security" },
      ],
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            <div
              className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer rounded-md"
              onClick={() => item.submenu && toggleSubmenu(item.name)}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.submenu && (
                openSubmenus[item.name] ? <FaChevronDown /> : <FaChevronRight />
              )}
            </div>
            {item.submenu && openSubmenus[item.name] && (
              <ul className="ml-6 mt-1 border-l border-gray-700 pl-2">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex} className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                    {subItem.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submenus;
