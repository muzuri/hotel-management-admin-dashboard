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
import { IoAddCircle, IoBed } from "react-icons/io5"
import Buttons from '../components/common/Buttons'
import GenerateInvoice from '../components/Invoices/GenerateInvoice'
import InvoiceList from '../components/Invoices/InvoiceList'
const InvoicesPage = () => {
     const [message, setMessage] = useState("invoiceList");
    //     const [viewStack, setViewStack] = useState(["ListBeds"]);
    //     const currentView = viewStack[viewStack.length-1];
    //     const goTo = (view) => setViewStack((prev) => [...prev, view]);
    //     const goBack = () => {
    //       console.log("back is Clicked ")
    //     if (viewStack.length > 1) {
    //       setViewStack((prev) => prev.slice(0, -1));
    //     }
    //     console.log("Hallo"+viewStack[0])
    //   };
    
        const updateMessage = (newMessage) => {
            setMessage(newMessage);
        }
  return (
    // <div className='flex-1 overflow-auto relative z-10'></div>
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Invoices Page"}></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className='flex gap-4 p-6'>
                <Buttons id={1} label={'Generate New Invoce'} icon= {<IoAddCircle size={12}></IoAddCircle>} onClick={()=> updateMessage("generateInvoice")} ></Buttons>
                <Buttons id={2} label={'Invoice List'}  icon = {<IoBed size={12}></IoBed>}onClick={()=> updateMessage("invoiceList")} ></Buttons>
            </div>
        {
        message ==='generateInvoice'
        ? <GenerateInvoice></GenerateInvoice>
        : <InvoiceList updateMessage={updateMessage}></InvoiceList>
        }
        </main>
    </div>
  )
};

export default InvoicesPage;