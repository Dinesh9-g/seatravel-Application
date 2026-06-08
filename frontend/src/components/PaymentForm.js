import { useState } from 'react';
import './Css/payment.css';

const PaymentForm = ({ voyage, cabin, passengerCount, onSubmit, onBack }) => {
  const [paymentMode, setPaymentMode] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!voyage || !cabin || typeof cabin.price !== 'number') {
    return (
      <div className="payment-placeholder">
        <h3>Payment Details Unavailable</h3>
        <p>Please ensure you have selected a voyage and cabin properly.</p>
        <button onClick={onBack} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  const totalPrice =  passengerCount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for card number and CVV
    if (name === 'cardNumber' && !/^\d*$/.test(value)) return;
    if (name === 'cvv' && !/^\d*$/.test(value)) return;
    
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment mode fields
    if (paymentMode === 'card') {
      if (!paymentData.cardName.trim()) {
        alert('Please enter the name on the card');
        return;
      }
      
      if (!/^\d{16}$/.test(paymentData.cardNumber)) {
        alert('Card number must be exactly 16 digits');
        return;
      }

      if (!paymentData.expiryDate) {
        alert('Please select expiry date');
        return;
      }

      if (!/^\d{3}$/.test(paymentData.cvv)) {
        alert('CVV must be exactly 3 digits');
        return;
      }
    }

    if (paymentMode === 'upi') {
      if (!paymentData.upiId.includes('@')) {
        alert('Enter a valid UPI ID (e.g., name@upi)');
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit({ ...paymentData, paymentMode, totalPrice });
    }, 1500);
  };


  return (
    <div className="payment-details">
      <h3>💳 Payment Information</h3>

      <div className="booking-summary">
        <p><strong>Voyage:</strong> {voyage.title}</p>
        <p><strong>Cabin:</strong> {cabin.type}</p>
        <p><strong>Number of Passengers:</strong> {passengerCount}</p>
        <p><strong>Price per person:</strong> ${cabin.price}</p>
        <p className="total-price"><strong>Total Amount:</strong> ${totalPrice}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Payment Method:</label>
          <select 
            value={paymentMode} 
            onChange={(e) => setPaymentMode(e.target.value)}
            disabled={isProcessing}
            required
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI (Indian Payment)</option>
          </select>
        </div>

        {paymentMode === 'card' && (
          <>
            <div className="form-group">
              <label>Name on Card:</label>
              <input
                type="text"
                name="cardName"
                placeholder="Enter name as shown on card"
                value={paymentData.cardName}
                onChange={handleChange}
                disabled={isProcessing}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleChange}
                disabled={isProcessing}
                maxLength={16}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date:</label>
                <input
                  type="month"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  disabled={isProcessing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>CVV:</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  disabled={isProcessing}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </>
        )}

        {paymentMode === 'upi' && (
          <div className="form-group">
            <label>UPI ID:</label>
            <input
              type="text"
              name="upiId"
              placeholder="example@upi"
              value={paymentData.upiId}
              onChange={handleChange}
              disabled={isProcessing}
              required
            />
            <small>Example: yourname@okhdfcbank or yourname@paytm</small>
          </div>
        )}

        <div className="booking-navigation">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onBack}
            disabled={isProcessing}
          >
            Back
          </button>
          <button 
            type="submit"
            className="cta-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${totalPrice}`}
          </button>
        </div>
        
        {isProcessing && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
            Processing your payment...
          </p>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
