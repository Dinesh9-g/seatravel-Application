// src/pages/BookingFlow.js
import { useState } from 'react';
import VoyageCard from '../components/VoyageCard';
import PassengerForm from '../components/PassengerForm';
import PaymentForm from '../components/PaymentForm';
import BookingSteps from '../components/BookingSteps';
import '../components/Css/Voyage.css';

const BookingFlow = ({ voyages, currentUser, addBooking }) => {
  const [step, setStep] = useState(1);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [passengerData, setPassengerData] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const maxPassengers = 5;

  // Filters (optional)
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  // Filter logic
  const filteredVoyages = voyages.filter((voyage) => {
    const duration = Number(voyage.duration);
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
    setStep(2);
  };

  const handlePassengerSubmit = (passengers) => {
    setPassengerData(passengers);
    setStep(3);
  };

  const handlePaymentSubmit = (paymentInfo) => {
    setPaymentData(paymentInfo);
    const booking = {
      voyage: selectedVoyage,
      user: currentUser,
      passengers: passengerData,
      payment: paymentInfo,
      date: new Date().toISOString(),
    };
    addBooking(booking);
    setStep(4);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="hero">
              <h1>Our Voyages</h1>
              <p>Find your perfect sea adventure</p>
            </div>

            <section className="all-voyages">
              <h2>All Available Voyages</h2>
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
                  <option value="1000">Under $1000</option>
                  <option value="2000">Under $2000</option>
                  <option value="3000">Under $3000</option>
                  <option value="3000+">Above $3000</option>
                </select>
              </div>

              <div className="voyage-list">
                {filteredVoyages.length > 0 ? (
                  filteredVoyages.map((voyage) => (
                    <VoyageCard
                      key={voyage.id}
                      voyage={voyage}
                      onSelect={() => handleVoyageSelect(voyage)}
                    />
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
        return (
          <PassengerForm
            maxPassengers={maxPassengers}
            onSubmit={handlePassengerSubmit}
            onBack={() => setStep(1)}
          />
        );

      case 3:
        return (
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep(2)}
          />
        );

      case 4:
        return (
          <div className="confirmation">
            <h2>🎉 Booking Confirmed!</h2>
            <p>Thank you for booking {selectedVoyage.name}.</p>
            <p>Passengers: {passengerData.length}</p>
            <p>Payment: {paymentData.cardNumber ? 'Received' : 'Pending'}</p>
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

export default BookingFlow;
