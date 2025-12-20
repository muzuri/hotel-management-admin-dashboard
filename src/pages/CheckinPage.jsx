import React, { useState } from 'react';
import Header from '../components/common/Header';
import CheckTable from '../components/checkin/List';
import CheckRegisterForm from '../components/checkin/List';
import EditCheck from '../components/checkin/EditCheckin';


const CheckPage = () => {
  const [message, setMessage] = useState("checkList");
  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };
  
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Checks"}></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {
          message ==='editCheck'
        ? <EditCheck/>
        :message ==='newCheck'
        ? <CheckRegisterForm updateMessage={updateMessage}/>
        // :message ==='bookedChecks'
        // ? <CRUDTable/>
        // :message === "availableChecks"
        // ? <UserCheck></UserCheck>
        : <CheckTable updateMessage={updateMessage}></CheckTable>
        }
        </main>
    </div>
  )
}

export default CheckPage