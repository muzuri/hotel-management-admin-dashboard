import React, { useState } from 'react';
import Header from '../components/common/Header';
import PromoTable from '../components/promos/PromoTable';
import PromoRegister from '../components/promos/AddPromo';


const PromoPage = () => {
  const [message, setMessage] = useState("promoList");
  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };
  
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Promos"} />
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            {message === "promoList" && <PromoTable updateMessage={updateMessage} />}
            {message === "newPromo" && <PromoRegister updateMessage={updateMessage} />}
        </main>
    </div>
  )
}

export default PromoPage