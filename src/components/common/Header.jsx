import React, { useEffect, useState } from 'react'

const Header = ({title}) => {
  const [names, setNames] = useState({})
  useEffect(()=>{
    handleNames()
  })
  const handleNames=()=>{
    const userObj = sessionStorage.getItem('user');
		if(!userObj) return;
    const user = JSON.parse(userObj);
    setNames(user.first_name + ' ' + user.last_name.charAt(0)+ '.')
  }
  return (
    <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
       <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-bold text-gra100'>{title}</h1>
          <p className="text-right"> {String(names)}</p>
        </div>
    </header>
  );
}
export default Header;
