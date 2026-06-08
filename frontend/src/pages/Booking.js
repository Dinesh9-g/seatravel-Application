import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CabinSelection from '../components/CabinSelection';
import PassengerForm from '../components/PassengerForm';
import PaymentForm from '../components/PaymentForm';
import BookingSteps from '../components/BookingSteps';
import '../components/Css/Voyage.css';

const Booking = ({ voyages, currentUser, addBooking }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [, setPassengerCount] = useState(1);
  const [passengerData, setPassengerData] = useState([]);
  const [, setPaymentData] = useState({});
  const maxPassengers = 5;

  // Filters
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Filter logic
  const filteredVoyages = voyages.filter((voyage) => {
    const duration = parseInt(voyage.duration);
    const price = Number(voyage.price);

    let durationMatch = true;
    if (durationFilter === '7') durationMatch = duration <= 7;
    else if (durationFilter === '14') durationMatch = duration > 7 && duration <= 14;
    else if (durationFilter === '14+') durationMatch = duration > 14;

    let priceMatch = true;
    if (priceFilter === '1000') priceMatch = price <= 1000;
    else if (priceFilter === '2000') priceMatch = price <= 2000;
    else if (priceFilter === '3000') priceMatch = price <= 3000;
    else if (priceFilter === '3000+') priceMatch = price > 3000;

    return durationMatch && priceMatch;
  });

  const handleVoyageSelect = (voyage) => {
    setSelectedVoyage(voyage);
    setSelectedCabin(null);
    setPassengerData([]);
    setStep(2);
  };

  const handleCabinSelect = (cabinType) => {
    const cabin = selectedVoyage.cabins.find(c => c.type === cabinType);
    setSelectedCabin(cabin);
    setStep(3);
  };

  const handlePassengerSubmit = (passengers) => {
    setPassengerData(passengers);
    setPassengerCount(passengers.length);
    setStep(4);
  };

  const handlePaymentSubmit = (paymentInfo) => {
    setPaymentData(paymentInfo);
    
    if (!currentUser) {
      alert('Please log in or register before completing your booking.');
      navigate('/my-account');
      return;
    }

    const booking = {
      id: Date.now(),
      userId: currentUser.id,
      voyageId: selectedVoyage.id,
      voyageName: selectedVoyage.title,
      cabinType: selectedCabin.type,
      cabinPrice: selectedCabin.price,
      passengerCount: passengerData.length,
      passengers: passengerData,
      totalPrice: selectedCabin.price * passengerData.length,
      payment: paymentInfo,
      date: new Date().toISOString(),
      status: 'Confirmed'
    };
    
    addBooking(booking);
    setStep(5);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="hero">
              <h1>🧳 All Available Voyages</h1>
              <p>Find your perfect sea adventure</p>
            </div>

            <section className="all-voyages">
              <h2>Browse Voyages</h2>
              <div className="filter-options">
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                >
                  <option value="all">All Durations</option>
                  <option value="7">7 nights or less</option>
                  <option value="14">8–14 nights</option>
                  <option value="14+">More than 14 nights</option>
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="1000">Under ₹1000</option>
                  <option value="2000">Under ₹2000</option>
                  <option value="3000">Under ₹3000</option>
                  <option value="3000+">Above ₹3000</option>
                </select>
              </div>

              <div className="voyage-list">
                {filteredVoyages.length > 0 ? (
                  filteredVoyages.map((voyage) => (
                    <div key={voyage.id} className="voyage-card">
                      <img 
                        src={voyage.image} 
                        alt={voyage.title}
                        className="voyage-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/270x180?text=' + voyage.title.replace(/\s+/g, '+');
                        }}
                      />
                      <div className="voyage-content">
                        <h3>{voyage.title}</h3>
                        <p className="description">{voyage.description}</p>
                        <div className="voyage-details">
                          <p><strong>📅 Departs:</strong> {new Date(voyage.departure).toLocaleDateString()}</p>
                          <p><strong>⏱️ Duration:</strong> {voyage.duration}</p>
                          <p><strong>🚢 Ports:</strong> {voyage.ports.join(' → ')}</p>
                        </div>
                        <p className="voyage-price"><strong>From ${voyage.price}</strong></p>
                        <button 
                          className="cta-button"
                          onClick={() => handleVoyageSelect(voyage)}
                        >
                          Select Voyage
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">
                    No voyages match your filters. Please try different criteria.
                  </p>
                )}
              </div>
            </section>
          </>
        );

      case 2:
        return selectedVoyage ? (
          <div className="cabin-section">
            <h2>Step 2: Select Your Cabin</h2>
            <div className="voyage-info-summary">
              <h3>{selectedVoyage.title}</h3>
              <p>Departure: {new Date(selectedVoyage.departure).toLocaleDateString()}</p>
            </div>
            <CabinSelection 
              voyage={selectedVoyage}
              onSelect={handleCabinSelect}
            />
            <div className="booking-navigation">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back to Voyages</button>
            </div>
          </div>
        ) : null;

      case 3:
        return selectedCabin ? (
          <div className="passenger-section">
            <h2>Step 3: Passenger Details</h2>
            <div className="booking-info-summary">
              <p><strong>Voyage:</strong> {selectedVoyage.title}</p>
              <p><strong>Cabin Type:</strong> {selectedCabin.type}</p>
              <p><strong>Price per person:</strong> ${selectedCabin.price}</p>
            </div>
            <PassengerForm
              maxPassengers={Math.min(maxPassengers, selectedCabin.maxOccupancy)}
              onSubmit={handlePassengerSubmit}
              onBack={() => setStep(2)}
            />
          </div>
        ) : null;

      case 4:
        return selectedVoyage && selectedCabin ? (
          <div className="payment-section">
            <h2>Step 4: Payment</h2>
            <PaymentForm
              voyage={selectedVoyage}
              cabin={selectedCabin}
              passengerCount={passengerData.length}
              onSubmit={handlePaymentSubmit}
              onBack={() => setStep(3)}
            />
          </div>
        ) : null;

      case 5:
        return (
          <div className="confirmation">
            <h2>🎉 Booking Confirmed!</h2>
            <div className="confirmation-details">
              <p><strong>Voyage:</strong> {selectedVoyage.title}</p>
              <p><strong>Cabin Type:</strong> {selectedCabin.type}</p>
              <p><strong>Passengers:</strong> {passengerData.length}</p>
              <p><strong>Total Cost:</strong> ${selectedCabin.price * passengerData.length}</p>
              <p><strong>Confirmation Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            <p style={{ marginTop: '20px', color: '#666' }}>
              A confirmation email has been sent to {currentUser?.email}
            </p>
            <button 
              className="cta-button"
              onClick={() => navigate('/my-account')}
            >
              View My Bookings
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-flow">
      <BookingSteps currentStep={step} />
      {renderStepContent()}
    </div>
  );
};

export default Booking;
