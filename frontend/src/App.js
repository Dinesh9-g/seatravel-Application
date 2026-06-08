import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Voyages from './pages/Voyages';
import Booking from './pages/Booking';
import MyAccount from './pages/MyAccount';
import Admin from './pages/Admin';
import { initialVoyages, initialBookings, initialUsers } from './voyages';

function App() {
  const [voyages, setVoyages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize data from localStorage or use initial data
  useEffect(() => {
    const storedVoyages = localStorage.getItem('voyages');
    const storedBookings = localStorage.getItem('bookings');
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');

    setVoyages(storedVoyages ? JSON.parse(storedVoyages) : initialVoyages);
    setBookings(storedBookings ? JSON.parse(storedBookings) : initialBookings);
    setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
    setCurrentUser(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);
  }, []);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    if (voyages.length > 0) {
      localStorage.setItem('voyages', JSON.stringify(voyages));
    }
  }, [voyages]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  const addUser = (user) => {
    setUsers(prevUsers => {
      const exists = prevUsers.some(existingUser => existingUser.email === user.email);
      if (exists) {
        return prevUsers;
      }
      return [...prevUsers, user];
    });
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addBooking = (booking) => {
    // Add the booking
    setBookings(prevBookings => [...prevBookings, booking]);
    
    // Update cabin availability when booking is confirmed
    setVoyages(prevVoyages =>
      prevVoyages.map(voyage => {
        if (voyage.id === booking.voyageId) {
          const updatedCabins = voyage.cabins.map(cabin => {
            if (cabin.type === booking.cabinType) {
              return { 
                ...cabin, 
                available: Math.max(0, cabin.available - 1) 
              };
            }
            return cabin;
          });
          return { ...voyage, cabins: updatedCabins };
        }
        return voyage;
      })
    );
  };

  const addVoyage = (voyage) => {
    const newVoyage = {
      ...voyage,
      id: voyages.length > 0 ? Math.max(...voyages.map(v => v.id)) + 1 : 1
    };
    setVoyages([...voyages, newVoyage]);
  };

  return (
    <Router>
      <ScrollToTop />
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
                  users={users}
                  currentUser={currentUser} 
                  loginUser={loginUser} 
                  addUser={addUser} 
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;