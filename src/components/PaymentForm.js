import { useState } from 'react';
import '../components/Css/payment.css';
const PaymentForm = ({ voyage, cabin, passengerCount, onSubmit, onBack }) => {
  const [paymentMode, setPaymentMode] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  if (!voyage || !cabin || typeof cabin.price !== 'number') {
    return (
      <div className="payment-placeholder">
        <h3>Payment Details Unavailable</h3>
        <p>Please ensure you have selected a voyage and cabin properly.</p>
        <button onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const totalPrice = cabin.price * passengerCount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMode === 'card') {
      if (!/^\d{16}$/.test(paymentData.cardNumber)) {
        alert('Enter a valid 16-digit card number');
        return;
      }

      if (!/^\d{3}$/.test(paymentData.cvv)) {
        alert('Enter a valid 3-digit CVV');
        return;
      }
    }

    if (paymentMode === 'upi' && !paymentData.upiId.includes('@')) {
      alert('Enter a valid UPI ID (e.g. name@upi)');
      return;
    }

    onSubmit({ ...paymentData, paymentMode });
  };

  return (
    <div className="payment-details">
      <h3>Payment Information</h3>

      <div className="booking-summary">
        <p><strong>Voyage:</strong> {voyage.title}</p>
        <p><strong>Cabin:</strong> {cabin.type}</p>
        <p><strong>Passengers:</strong> {passengerCount}</p>
        <p><strong>Total Price:</strong> ₹{totalPrice}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Payment Mode:</label>
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} required>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        {paymentMode === 'card' && (
          <>
            <input
              type="text"
              name="cardName"
              placeholder="Name on Card"
              value={paymentData.cardName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentData.cardNumber}
              onChange={handleChange}
              required
              maxLength={16}
            />
            <div className="form-row">
              <input
                type="month"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={paymentData.cvv}
                onChange={handleChange}
                required
                maxLength={3}
              />
            </div>
          </>
        )}

        {paymentMode === 'upi' && (
          <input
            type="text"
            name="upiId"
            placeholder="Enter your UPI ID (e.g., name@upi)"
            value={paymentData.upiId}
            onChange={handleChange}
            required
          />
        )}

        <div className="booking-navigation">
          <button type="button" onClick={onBack}>Back</button>
          <button type="submit">Confirm Booking</button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
