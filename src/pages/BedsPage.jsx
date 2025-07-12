import React, {useState} from 'react'
import Header from '../components/common/Header'
import BedsTable from '../components/Beds/BedsTable'
import BedRegister from '../components/Beds/BedRegister'
import BookedBeds from '../components/Beds/BookedBeds'
import UserRoom from '../components/rooms/UserRoom'
import CRUDTable from '../components/rooms/CRUDTable'
import AvailableBeds from '../components/Beds/AvailableBeds'
import AssignRoomBeds from '../components/rooms/AssignRoomBeds'

const BedsPage = () => {
    const [message, setMessage] = useState("bedList");
    const updateMessage = (newMessage) => {
        setMessage(newMessage);
    }
    
  return (
    // <div className='flex-1 overflow-auto relative z-10'></div>
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Beds in Hotel"}></Header>
        {/* <BedsTable></BedsTable> */}
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {
        message ==='assignBed'
        ? <AssignRoomBeds updateMessage={updateMessage}></AssignRoomBeds>
        : message ==='newBed'
        ? <BedRegister updateMessage={updateMessage}></BedRegister>
        :message ==='bookedBed'
        ? <BookedBeds/>
        :message === "availableBed"
        ? <AvailableBeds updateMessage={updateMessage}></AvailableBeds>
        : <BedsTable updateMessage={updateMessage}></BedsTable>
        }
        </main>
    </div>
  )
}

export default BedsPage