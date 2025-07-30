import { useState } from 'react';
import { Link } from 'react-router-dom';
import VoyageCard from '../components/VoyageCard';
import '../components/Css/Voyage.css';

const Voyages = ({ voyages }) => {
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredVoyages = voyages.filter((voyage) => {
    const durationNights = Number(voyage.duration);
    const voyagePrice = Number(voyage.price);

  
    let durationMatch = true;
    if (durationFilter === '7') {
      durationMatch = durationNights <= 7;
    } else if (durationFilter === '14') {
      durationMatch = durationNights > 7 && durationNights <= 14;
    } else if (durationFilter === '14+') {
      durationMatch = durationNights > 14;
    }

    
    let priceMatch = true;
    if (priceFilter === '1000') {
      priceMatch = voyagePrice <= 1000;
    } else if (priceFilter === '2000') {
      priceMatch = voyagePrice <= 2000;
    } else if (priceFilter === '3000') {
      priceMatch = voyagePrice <= 3000;
    } else if (priceFilter === '3000+') {
      priceMatch = voyagePrice > 3000;
    }

    return durationMatch && priceMatch;
  });

  return (
    <>
      <div className="hero">
        <h1>Our Voyages</h1>
        <p>Find your perfect sea adventure</p>
      </div>

      <section className="all-voyages">
        <h2>All Available Voyages</h2>

        {/* Filters */}
        <div className="filter-options">
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="all">All Durations</option>
            <option value="7">7 nights or less</option>
            <option value="14">8-14 nights</option>
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

        {/* Voyages list */}
        <div className="voyage-list">
          {filteredVoyages.length > 0 ? (
            filteredVoyages.map((voyage) => (
              <VoyageCard key={voyage.id} voyage={voyage} />
            ))
          ) : (
            <p className="no-results">
              No voyages match your filters. Please try different criteria.
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="action-buttons">
          <Link to="/passengerForm" className="action-button">
            🧍 Passenger Form
          </Link>
          <Link to="/paymentForm" className="action-button">
            💳 Payment Form
          </Link>
          <Link to="/admin" className="action-button">
            🛠️ Admin
          </Link>
          <Link to="/bookingsteps" className="action-button">
            📘 Booking Steps
          </Link>
        </div>
      </section>
    </>
  );
};

export default Voyages;
