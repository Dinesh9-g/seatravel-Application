import { useState } from 'react';
import '../components/Css/MyAccount.css';

const Admin = ({ voyages, bookings, users = [] }) => {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="account-section">
      <div className="account-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Manage voyages and bookings</p>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 All Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'voyages' ? 'active' : ''}`}
          onClick={() => setActiveTab('voyages')}
        >
          🚢 Voyages
        </button>
        <button 
          className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          📊 Statistics
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="tab-content active">
          <h2>All Bookings</h2>
          <p>Total Bookings: <strong>{bookings.length}</strong></p>
          <p>Registered Users: <strong>{users.length}</strong></p>
          
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Booking ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>User Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>User Email</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Voyage</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Cabin</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Passengers</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Total Price</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const user = users.find(u => u.id === booking.userId) || {};
                    return (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{booking.id}</td>
                      <td style={{ padding: '10px' }}>{user.name || booking.userId}</td>
                      <td style={{ padding: '10px' }}>{user.email || 'N/A'}</td>
                      <td style={{ padding: '10px' }}>{booking.voyageName}</td>
                      <td style={{ padding: '10px' }}>{booking.cabinType}</td>
                      <td style={{ padding: '10px' }}>{booking.passengerCount}</td>
                      <td style={{ padding: '10px' }}>${booking.totalPrice}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          backgroundColor: booking.status === 'Confirmed' ? '#d4edda' : '#fff3cd',
                          color: booking.status === 'Confirmed' ? '#155724' : '#856404'
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{new Date(booking.date).toLocaleDateString()}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="tab-content">
          <h2>Registered Users</h2>
          <p>Total Users: <strong>{users.length}</strong></p>

          {users.length === 0 ? (
            <p>No user accounts are registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>User ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{user.id}</td>
                      <td style={{ padding: '10px' }}>{user.name}</td>
                      <td style={{ padding: '10px' }}>{user.email}</td>
                      <td style={{ padding: '10px' }}>{user.role || 'user'}</td>
                      <td style={{ padding: '10px' }}>{new Date(user.id).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'voyages' && (
        <div className="tab-content">
          <h2>Voyages Management</h2>
          <p>Total Voyages: <strong>{voyages.length}</strong></p>
          
          <div style={{ marginTop: '20px' }}>
            {voyages.map(voyage => (
              <div key={voyage.id} style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                marginBottom: '15px'
              }}>
                <h3>{voyage.title}</h3>
                <p><strong>Departure:</strong> {new Date(voyage.departure).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {voyage.duration}</p>
                <p><strong>Ports:</strong> {voyage.ports.join(' → ')}</p>
                <p><strong>Base Price:</strong> ${voyage.price}</p>
                
                <h4>Cabin Availability:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {voyage.cabins.map(cabin => (
                    <div key={cabin.type} style={{ 
                      padding: '10px', 
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>
                      <p><strong>{cabin.type}</strong></p>
                      <p>Price: ${cabin.price}</p>
                      <p>Available: {cabin.available}</p>
                      <p>Max Occupancy: {cabin.maxOccupancy}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="tab-content">
          <h2>Statistics</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e3f2fd',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Total Bookings</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>{bookings.length}</p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f3e5f5',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Total Voyages</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>{voyages.length}</p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e8f5e9',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Total Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
              </p>
            </div>
            
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fff3e0',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <h3>Total Passengers</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                {bookings.reduce((sum, b) => sum + (b.passengerCount || 0), 0)}
              </p>
            </div>
          </div>

          <h3 style={{ marginTop: '30px' }}>Booking Status Distribution</h3>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <p>Confirmed: {bookings.filter(b => b.status === 'Confirmed').length}</p>
            <p>Pending: {bookings.filter(b => b.status === 'Pending').length}</p>
            <p>Cancelled: {bookings.filter(b => b.status === 'Cancelled').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;