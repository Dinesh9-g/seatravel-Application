import { useState } from 'react';
import { Link } from 'react-router-dom';

const MyAccount = ({ bookings, voyages, currentUser, loginUser }) => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  const userBookings = currentUser 
    ? bookings.filter(b => b.userId === currentUser.id)
    : [];

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, validate credentials against stored users
    const user = { id: Date.now(), name: 'Demo User', email: loginForm.email };
    loginUser(user);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password // In real app, hash this
    };
    loginUser(newUser);
  };

  if (!currentUser) {
    return (
      <div className="auth-forms">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="cta-button">Login</button>
          </form>
        </div>
        
        <div className="register-form">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="cta-button">Register</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="account-section">
      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>
      
      {activeTab === 'bookings' && (
        <div className="tab-content active" id="bookingsTab">
          <h2>My Bookings</h2>
          <div className="bookings-list">
            {userBookings.length === 0 ? (
              <p>You have no bookings yet. <Link to="/voyages">Browse voyages</Link> to get started!</p>
            ) : (
              userBookings.map(booking => {
                const voyage = voyages.find(v => v.id === booking.voyageId);
                return (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h3>{voyage.title}</h3>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Booking Reference:</strong> {booking.id}</p>
                      <p><strong>Departure:</strong> {new Date(voyage.departure).toLocaleDateString()}</p>
                      <p><strong>Cabin:</strong> {booking.cabinType}</p>
                      <p><strong>Passengers:</strong> {booking.passengers.length}</p>
                      <p><strong>Total Paid:</strong> ${booking.totalPrice}</p>
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
          <form className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={currentUser.name} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={currentUser.email} readOnly />
            </div>
            <div className="form-group">
              <label>Change Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <button type="button" className="cta-button">Update Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyAccount;