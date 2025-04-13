import React, { useState } from 'react';
import Header from '../components/common/Header';
import RoomTable from '../components/rooms/RoomTable';
import CRUDTable from '../components/rooms/CRUDTable';
import RoomRegisterForm from '../components/rooms/RoomRegisterForm';
import UserRoom from '../components/rooms/UserRoom';
import EditRoom from '../components/rooms/EditRoom';


const RoomPage = () => {
  const [message, setMessage] = useState("roomList");
  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };
  
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Rooms"}></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {
          message ==='editRoom'
        ? <EditRoom/>
        :message ==='newRoom'
        ? <RoomRegisterForm updateMessage={updateMessage}/>
        :message ==='bookedRooms'
        ? <CRUDTable/>
        :message === "availableRooms"
        ? <UserRoom></UserRoom>
        : <RoomTable updateMessage={updateMessage}></RoomTable>
        }
        </main>
    </div>
  )
}

export default RoomPage