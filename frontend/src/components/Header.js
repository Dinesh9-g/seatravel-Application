import { Link } from 'react-router-dom';
import '../components/Css/Header.css';
const Header = ({ currentUser, logoutUser }) => {
  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">Oceanic Voyages</Link>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/voyages">Voyages</Link></li>
          <li><Link to="/booking">Book Now</Link></li>
          <li>
            {currentUser ? (
              <Link to="/my-account">
                Welcome, {currentUser.name.split(' ')[0]}
              </Link>
            ) : (
              <Link to="/my-account">My Account</Link>
            )}
          </li>
          {currentUser && (
            <li>
              <button onClick={logoutUser}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;