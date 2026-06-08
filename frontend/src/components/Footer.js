import { Link } from 'react-router-dom';
import '../components/Css/Footer.css';
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>info@oceanicvoyages.com</p>
          <p>+1 (800) 555-OCEAN</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/voyages">All Voyages</Link></li>
            <li><Link to="/booking">Special Offers</Link></li>
            <li><Link to="/my-account">Manage Booking</Link></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2023 Oceanic Voyages. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;