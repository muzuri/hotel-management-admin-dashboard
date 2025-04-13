import { Route, Routes } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage'
import Sidebar from './components/Sidebar'
import UsersPage from './pages/UsersPage'
import SalesPage from './pages/SalesPage'
import OrdersPage from './pages/OrdersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import BookingsPage from './pages/BookingsPage'
import RoomPage from './pages/RoomPage'
import BedsPage from './pages/BedsPage'

function App() {

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>

      {/* Background properties */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-90 via-gray-900 to-gray-900 opacity-90'></div>
        <div className='absolute inset-0 backdrop-blur-sm'></div>
      </div>
      <Sidebar></Sidebar>
      <Routes>
        <Route path='/' element={<OverviewPage></OverviewPage>}> </Route>
        <Route path='/bookings' element={<BookingsPage></BookingsPage>}></Route>
        <Route path='/users' element={<UsersPage></UsersPage>}></Route>
        <Route path='/sales' element={<SalesPage></SalesPage>}></Route>
        <Route path='/orders' element={<OrdersPage></OrdersPage>}></Route>
        <Route path='/analytics' element={<AnalyticsPage></AnalyticsPage>}></Route>
        <Route path='/settings' element={<SettingsPage></SettingsPage>}></Route>
        <Route path='/rooms' element={<RoomPage></RoomPage>}></Route>
        <Route path='/beds' element={<BedsPage></BedsPage>}></Route>
      </Routes>
    </div>
    
    
    
    

  )
}

export default App
