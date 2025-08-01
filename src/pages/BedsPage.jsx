import React, {useState} from 'react'
import Header from '../components/common/Header'
import BedsTable from '../components/Beds/BedsTable'
import BedRegister from '../components/Beds/BedRegister'
import BookedBeds from '../components/Beds/BookedBeds'
import UserRoom from '../components/rooms/UserRoom'
import CRUDTable from '../components/rooms/CRUDTable'
import AvailableBeds from '../components/Beds/AvailableBeds'
import AssignRoomBeds from '../components/rooms/AssignRoomBeds'
import BedsDeactivate from '../components/Beds/BedsDeactivate'
import BackButton from '../components/common/BackButton'
import { Edit, Search, Trash2, Plus, Backpack } from "lucide-react";
import { IoAddCircle, IoBed } from "react-icons/io5"
import Buttons from '../components/common/Buttons'

const BedsPage = () => {
    const [message, setMessage] = useState("bedList");
    const [viewStack, setViewStack] = useState(["ListBeds"]);
    const currentView = viewStack[viewStack.length-1];
    const goTo = (view) => setViewStack((prev) => [...prev, view]);
    const goBack = () => {
      console.log("back is Clicked ")
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, -1));
    }
    console.log("Hallo"+viewStack[0])
  };

    const updateMessage = (newMessage) => {
        setMessage(newMessage);
    }

    
  return (
    // <div className='flex-1 overflow-auto relative z-10'></div>
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Beds in Hotel"}></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='flex gap-4 p-6'>
                <Buttons id={1} label={'Add new Bed'} icon= {<IoAddCircle size={12}></IoAddCircle>} onClick={()=> updateMessage("assignBed")} ></Buttons>
                <Buttons id={2} label={'Booked Bed'}  icon = {<IoBed size={12}></IoBed>}onClick={()=> updateMessage("bookedBed")} ></Buttons>
                <Buttons id={3} label={'AvailableBed'} icon={<IoBed size={12}></IoBed>} onClick={()=> updateMessage("availableBed")} ></Buttons>
				        <Buttons id={4} label={'DeactivateBed'} icon={<IoBed size={12}></IoBed>} onClick={()=> updateMessage("deactivateBed")} ></Buttons>
				        <Buttons id={5} label={'All Beds'} icon={<IoBed size={12}></IoBed>} onClick={()=> updateMessage("beds")} ></Buttons>
            </div>
        {
        message ==='assignBed'
        ? <AssignRoomBeds updateMessage={updateMessage}></AssignRoomBeds>

        : message ==='newBed'
        ? <BedRegister updateMessage={updateMessage}></BedRegister>

        :message ==='bookedBed'
        ? <BookedBeds/>

        :message === "availableBed"
        ? <AvailableBeds updateMessage={updateMessage}></AvailableBeds>
        :message==="deactivateBed"
        ?<BedsDeactivate></BedsDeactivate>
        :message ==="beds"
        ?<BedsTable></BedsTable>
        : <BedsTable updateMessage={updateMessage}></BedsTable>
        }
        </main>
    </div>
  )
}

export default BedsPage