import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import FlightPage from './pages/FlightPage'
import BookingPage from './pages/BookingPage'
import TicketPage from './pages/TicketPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flight" element={<FlightPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App