import { useState } from 'react';
import '../components/Css/passengerform.css';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedPassengers = passengers.slice(0, passengerCount);
    //onSubmit(submittedPassengers);
    navigate("/paymentForm");
  };

  return (
    <div className="passenger-details">
      <h3>Passenger Information</h3>
      <form onSubmit={handleSubmit}>
       
        {Array.from({ length: passengerCount }).map((_, i) => (
          <div key={i} className="passenger-form">
            <h4>Passenger {i + 1}</h4>
            <input type="text" placeholder="Full Name" value={passengers[i].name}
              onChange={(e) => handlePassengerChange(i, 'name', e.target.value)} required />
            <input type="date" placeholder="DOB" value={passengers[i].dob}
              onChange={(e) => handlePassengerChange(i, 'dob', e.target.value)} required />
            <input type="text" placeholder="Passport" value={passengers[i].passport}
              onChange={(e) => handlePassengerChange(i, 'passport', e.target.value)} required />
          </div>
        ))}

       
        <div className="booking-navigation">
          <button type="button" onClick={onBack}>Back</button>
          <button type="submit">Next: Payment</button>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
