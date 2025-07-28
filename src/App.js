import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Voyages from './pages/Voyages';
import Booking from './pages/Booking';
import MyAccount from './pages/MyAccount';
import Admin from './pages/Admin';
import { initialVoyages, initialBookings, initialUsers } from './voyages';
import PassengerForm from './components/PassengerForm';
import PaymentForm from './components/PaymentForm';
import CabinSelection from './components/CabinSelection';
import BookingSteps from './components/BookingSteps';

function App() {
  const [voyages, setVoyages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize data
  useEffect(() => {
    const storedVoyages = JSON.parse(localStorage.getItem('voyages')) || initialVoyages;
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || initialBookings;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || initialUsers;
    const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

    setVoyages(storedVoyages);
    setBookings(storedBookings);
    setUsers(storedUsers);
    setCurrentUser(storedCurrentUser);
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('voyages', JSON.stringify(voyages));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [voyages, bookings, users, currentUser]);

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addBooking = (booking) => {
    setBookings([...bookings, booking]);
    
    // Update cabin availability
    const updatedVoyages = voyages.map(voyage => {
      if (voyage.id === booking.voyageId) {
        const updatedCabins = voyage.cabins.map(cabin => {
          if (cabin.type === booking.cabinType) {
            return { ...cabin, available: cabin.available - 1 };
          }
          return cabin;
        });
        return { ...voyage, cabins: updatedCabins };
      }
      return voyage;
    });
    setVoyages(updatedVoyages);
  };

  const addVoyage = (voyage) => {
    setVoyages([...voyages, voyage]);
  };

  return (
    <Router>
      <div className="App">
        <Header currentUser={currentUser} logoutUser={logoutUser} />
        <main>
          <Routes>
            <Route path="/" element={<Home voyages={voyages} />} />
            <Route path="/voyages" element={<Voyages voyages={voyages} />} />
            <Route 
              path="/booking" 
              element={
                <Booking 
                  voyages={voyages} 
                  currentUser={currentUser} 
                  addBooking={addBooking} 
                />
              } 
            />
            <Route 
              path="/my-account" 
              element={
                <MyAccount 
                  bookings={bookings} 
                  voyages={voyages} 
                  currentUser={currentUser} 
                  loginUser={loginUser} 
                />
              } 
            />
             <Route 
              path="/passengerForm" 
              element={
                <PassengerForm 
                  bookings={bookings} 
                  voyages={voyages} 
                  currentUser={currentUser} 
                  loginUser={loginUser} 
                />
              } 
            />
             <Route 
              path="/paymentForm" 
              element={
                <PaymentForm
                  bookings={bookings} 
                  voyages={voyages} 
                  currentUser={currentUser} 
                  loginUser={loginUser} 
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <Admin 
                  voyages={voyages} 
                  bookings={bookings} 
                  users={users} 
                  addVoyage={addVoyage} 
                />
              } 
            />
             <Route 
              path="/bookingsteps" 
              element={
                <BookingSteps
                  voyages={voyages} 
                  bookings={bookings} 
                  users={users} 
                  addVoyage={addVoyage} 
                />
              } 
            />
             <Route 
              path="/cabinselection" 
              element={
                <CabinSelection
                  voyages={voyages} 
                  bookings={bookings} 
                  users={users} 
                  addVoyage={addVoyage} 
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;