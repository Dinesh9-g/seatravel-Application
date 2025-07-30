import { Link } from 'react-router-dom';
import '../components/Css/VoyageCard.css';



const VoyageCard = ({ voyage }) => {
  return (
    <div className="voyage-card">
      <img src={voyage.image} alt={voyage.title} />
      <div className="voyage-info">
        <h3>{voyage.title} </h3>
        <p>{voyage.description}</p>
        <p><strong>Departs:</strong> {new Date(voyage.departure).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> {voyage.duration}</p>
        <p className="voyage-price">From {voyage.price}</p>
        <Link to={`/bookingsteps?voyage=₹{voyage.id}`} className="cta-button">Book Now</Link>
      </div>
    </div>
  );
};

export default VoyageCard;