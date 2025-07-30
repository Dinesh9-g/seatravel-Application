import { Link } from 'react-router-dom';
import VoyageCard from '../components/VoyageCard';
import '../components/Css/Home.css';
import image from '../Images/luxury-bedroom.jpg';
import image1 from '../Images/arborek-island-atoll.jpg';
import image2 from '../Images/table-with-cheese-plate-pate.jpg';
import image3 from '../Images/rock-band.jpg';
import image4 from '../Images/customer.jpg';
import Image5 from '../Images/speed-boat-andaman.jpg';
import Image6 from '../Images/watching-dolphins-swim.jpg';
import Image8 from '../Images/generated-boat-picture.jpg';
import Lottie from "lottie-react";
import anime from "../Images/ship is sailing.json";

const Home = ({ voyages }) => {
  const featuredVoyages = voyages.slice(0, 3);
  const featuredTrips = [
    {
      id: 1,
      image: Image5,
      title: "Andaman Adventure",
      duration: "7 nights",
      price: "$999",
      link: "/voyages"
    },
    {
      id: 2,
      image: Image6,
      title: "Dolphin Discovery",
      duration: "5 nights",
      price: "$799",
      link: "/voyages"
    },
    {
      id: 3,
      image: Image8,
      title: "Sunset Luxury Cruise",
      duration: "3 nights",
      price: "$1299",
      link: "/voyages"
    }
  ];

  return (
    <>
      <div className="hero">
        <h1>Discover the Seven Seas</h1>
        <p>Luxury cruises to the most breathtaking destinations</p>
        {/* <Link to="/voyages" className="cta-button">Explore Voyages</Link> */}
   
                  <Lottie animationData={anime} loop={true}
                style={{ width: '400px', height: '300px' }}

                     />

      </div>

      <section className="featured-voyages">
        <div className="featured-header">
        
        </div>

        
        <div className="voyage-gallery">
          {featuredTrips.map(trip => (
            <div className="voyage-card" key={trip.id}>
              <img src={trip.image} alt={trip.title} className="voyage-image" />
              <div className="voyage-caption">
                <h3>{trip.title}</h3>
                <p>{trip.duration} from {trip.price}</p>
                <Link to={trip.link} className="btn-small">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="popular-voyages">
        <h2>Popular Voyages</h2>
        <div className="voyage-list">
          {featuredVoyages.map(voyage => (
            <VoyageCard key={voyage.id} voyage={voyage} />
          ))}
        </div>
        <Link to="/voyages" className="cta-button secondary">View All Voyages</Link>
      </section>

      <section className="benefits">
        <h2>Why Choose Us</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <img src={image} alt="Luxury cabin interior" />
            <h3>Luxury Accommodations</h3>
            <p>5-star cabins with ocean views</p>
          </div>

          <div className="benefit-card">
            <img src={image1} alt="Tropical island destination" />
            <h3>Exotic Destinations</h3>
            <p>Travel to the world's most beautiful locations</p>
          </div>

          <div className="benefit-card">
            <img src={image2} alt="Gourmet food presentation" />
            <h3>Gourmet Dining</h3>
            <p>World-class cuisines prepared by top chefs</p>
          </div>

          <div className="benefit-card">
            <img src={image3} alt="Live band performance" />
            <h3>Onboard Entertainment</h3>
            <p>Enjoy live shows, music, and themed nights</p>
          </div>

          <div className="benefit-card">
            <img src={image4} alt="Customer service representative" />
            <h3>24/7 Customer Support</h3>
            <p>We're here to assist you anytime, anywhere</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;