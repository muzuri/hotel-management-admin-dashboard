import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import Sidebar from './components/Sidebar'
import UsersPage from './pages/UsersPage'
import SalesPage from './pages/SalesPage'
import OrdersPage from './pages/OrdersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import BookingsPage from './pages/BookingsPage'
import RoomPage from './pages/RoomPage'
import ProtectedRoute from './components/Authentication/ProtectedRoute'
import BedsPage from './pages/BedsPage'
import PaymentPage from './pages/PaymentPage'
import LogoutPage from './pages/LogoutPage'
import InvoicesPage from './pages/InvoicesPage'
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/Authentication/PrivateRoute'
import RegistrationPage from './pages/RegistrationPage'

function App() {
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

      {/* Background properties */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-90 via-gray-900 to-gray-900 opacity-90'></div>
        <div className='absolute inset-0 backdrop-blur-sm'></div>
      </div>
      <AuthProvider>
        <PrivateRoute>
          <Sidebar/>
        </PrivateRoute>
        <Routes>
          <Route path='/registration' element={<ProtectedRoute><RegistrationPage/></ProtectedRoute>}></Route>
          <Route path='/' element={<ProtectedRoute><BookingsPage/></ProtectedRoute>}></Route>
          <Route path='/bookings' element={<ProtectedRoute><BookingsPage/></ProtectedRoute>}></Route>
          <Route path='/users' element={<ProtectedRoute><UsersPage/></ProtectedRoute>}></Route>
          <Route path='/sales' element={<ProtectedRoute><SalesPage/></ProtectedRoute>}></Route>
          <Route path='/orders' element={<ProtectedRoute><OrdersPage/></ProtectedRoute>} ></Route>
          <Route path='/payments' element={<ProtectedRoute><PaymentPage/></ProtectedRoute>} ></Route>
          <Route path='/invoices' element={<ProtectedRoute><InvoicesPage/></ProtectedRoute>} ></Route>
          <Route path='/analytics' element={<ProtectedRoute><AnalyticsPage/></ProtectedRoute>}></Route>
          <Route path='/settings' element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}></Route>
          <Route path='/rooms' element={<ProtectedRoute><RoomPage/></ProtectedRoute>}></Route>
          <Route path='/beds' element={<ProtectedRoute><BedsPage/></ProtectedRoute>}></Route>
          <Route path='/logout' element={<ProtectedRoute><LogoutPage/></ProtectedRoute>}></Route>
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
