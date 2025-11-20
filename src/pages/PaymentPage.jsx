import React, { useState } from 'react';
import Header from '../components/common/Header';
import PaymentTable from '../components/payments/PaymentsTable';
// import CRUDTable from '../components/payments/CRUDTable';
// import PaymentRegisterForm from '../components/payments/PaymentRegisterForm';
// import UserPayment from '../components/payments/UserPayment';
// import EditPayment from '../components/payments/EditPayment';


const PaymentPage = () => {
  const [message, setMessage] = useState("paymentList");
  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };
  
  return (
    <div className='flex-1 overflow-auto relative z-10'>
        <Header title={"Payments"}></Header>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <PaymentTable updateMessage={updateMessage}></PaymentTable>
        </main>
    </div>
  )
}

export default PaymentPage