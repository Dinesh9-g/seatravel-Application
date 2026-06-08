import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Css/MyAccount.css';

const MyAccount = ({ bookings, voyages, users, currentUser, loginUser, addUser }) => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);

  const userBookings = currentUser 
    ? bookings.filter(b => b.userId === currentUser.id)
    : [];

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      alert('Please fill in all fields');
      return;
    }

    const existingUser = users.find(user => user.email === loginForm.email);

    const user = existingUser || {
      id: Date.now(),
      name: 'Guest User',
      email: loginForm.email,
      role: 'user'
    };

    if (!existingUser) {
      addUser(user);
    }

    loginUser(user);
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert('Please fill in all fields');
      return;
    }

    if (registerForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role: 'user'
    };

    addUser(newUser);
    loginUser(newUser);
    setRegisterForm({ name: '', email: '', password: '' });
    setShowRegister(false);
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-forms">
          {!showRegister ? (
            <div className="login-form">
              <h2>👤 Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className="cta-button">Login</button>
              </form>
              <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Don't have an account? 
                <button 
                  onClick={() => setShowRegister(true)}
                  style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Register here
                </button>
              </p>
            </div>
          ) : (
            <div className="register-form">
              <h2>📝 Register</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <button type="submit" className="cta-button">Register</button>
              </form>
              <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Already have an account? 
                <button 
                  onClick={() => setShowRegister(false)}
                  style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Login here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="account-section">
      <div className="account-header">
        <h2>Welcome, {currentUser.name}!</h2>
        <p>Email: {currentUser.email}</p>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📚 My Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>
      
      {activeTab === 'bookings' && (
        <div className="tab-content active" id="bookingsTab">
          <h2>My Bookings</h2>
          <div className="bookings-list">
            {userBookings.length === 0 ? (
              <div className="no-bookings">
                <p>You have no bookings yet.</p>
                <Link to="/booking" className="cta-button">Browse Voyages</Link>
              </div>
            ) : (
              userBookings.map(booking => {
                const voyage = voyages.find(v => v.id === booking.voyageId);
                return (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>{booking.voyageName}</h3>
                      <span className={`booking-status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Booking ID:</strong> {booking.id}</p>
                      <p><strong>Departure:</strong> {voyage ? new Date(voyage.departure).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Cabin Type:</strong> {booking.cabinType}</p>
                      <p><strong>Number of Passengers:</strong> {booking.passengerCount}</p>
                      <p><strong>Total Amount Paid:</strong> ${booking.totalPrice}</p>
                      <p><strong>Booked on:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="tab-content" id="profileTab">
          <h2>My Profile</h2>
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={currentUser.name} disabled />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={currentUser.email} disabled />
            </div>
            <div className="form-group">
              <label>Member Since</label>
              <input 
                type="text" 
                value={new Date(currentUser.id).toLocaleDateString()} 
                disabled 
              />
            </div>
            <p style={{ marginTop: '20px', color: '#999' }}>
              Contact support to update your profile information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;