import { useState } from 'react';
import './Css/passengerform.css';

const PassengerForm = ({ maxPassengers, onSubmit, onBack }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [passengers, setPassengers] = useState(
    Array(maxPassengers).fill().map(() => ({
      name: '',
      dob: '',
      passport: ''
    }))
  );

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all passengers are filled
    const submittedPassengers = passengers.slice(0, passengerCount);
    const allFilled = submittedPassengers.every(p => p.name && p.dob && p.passport);
    
    if (!allFilled) {
      alert('Please fill in all passenger details (Name, Date of Birth, Passport)');
      return;
    }

    onSubmit(submittedPassengers);
  };

  return (
    <div className="passenger-details">
      <h3>Passenger Information</h3>
      
      <div className="passenger-count-selector">
        <label>Number of Passengers: </label>
        <select 
          value={passengerCount} 
          onChange={(e) => setPassengerCount(parseInt(e.target.value))}
        >
          {Array.from({ length: maxPassengers }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {Array.from({ length: passengerCount }).map((_, i) => (
          <div key={i} className="passenger-form">
            <h4>Passenger {i + 1}</h4>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={passengers[i].name}
              onChange={(e) => handlePassengerChange(i, 'name', e.target.value)} 
              required 
            />
            <input 
              type="date" 
              placeholder="Date of Birth" 
              value={passengers[i].dob}
              onChange={(e) => handlePassengerChange(i, 'dob', e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Passport Number" 
              value={passengers[i].passport}
              onChange={(e) => handlePassengerChange(i, 'passport', e.target.value)} 
              required 
            />
          </div>
        ))}

        <div className="special-requests">
          <label>Special Requests (Optional):</label>
          <textarea 
            placeholder="Any dietary restrictions, mobility needs, or other requests?"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows="4"
          />
        </div>

        <div className="booking-navigation">
          <button type="button" className="btn-secondary" onClick={onBack}>Back</button>
          <button type="submit" className="cta-button">Next: Payment</button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
