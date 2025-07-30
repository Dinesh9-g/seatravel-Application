// voyages.js
import image1 from '../src/Images/arborek-island-atoll.jpg';

import image2 from '../src/Images/blue-villa-beautiful-sea-hotel.jpg';
import image3 from '../src/Images/beautiful-beach.jpg';




export const initialVoyages = [
  {
    id: 1,
    title: "Caribbean Paradise",
    description: "7-night  exotic Caribbean islands",
    image: image1, // Adjusted path for public directory
    departure: "2025-12-15",
    duration: "7 nights",
    ports: ["Miami", "Nassau", "St. Thomas", "San Juan"],
    price: "₹22299",
    cabins: [
      { type: "Interior", price: 1299, available: 15, maxOccupancy: 2 },
      { type: "Ocean View", price: 1599, available: 8, maxOccupancy: 2 },
      { type: "Balcony", price: 1999, available: 5, maxOccupancy: 4 },
      { type: "Suite", price: 2999, available: 2, maxOccupancy: 4 }
    ]
  },
  {
    id: 2,
    title: "Island Getaway resorts",
    description: "7-night cruise Getaway resorts islands",
    image: image2,
    departure: "2025-12-15",
    duration: "7 nights",
    ports: ["Miami", "Nassau", "St. Thomas", "San Juan"],
    price: "₹61299",
    cabins: [
      { type: "Interior", price: 1299, available: 15, maxOccupancy: 2 },
      { type: "Ocean View", price: 1599, available: 8, maxOccupancy: 2 },
      { type: "Balcony", price: 1999, available: 5, maxOccupancy: 4 },
      { type: "Suite", price: 2999, available: 2, maxOccupancy: 4 }
    ]
  }
  ,
  {
    id: 3,
    title: "Curise",
    description: "7-night cruise  islands",
    image: image3,
    departure: "2025-12-15",
    duration: "7 nights",
    ports: ["Miami", "Nassau", "St. Thomas", "San Juan"],
    price: "₹31299",
    cabins: [
      { type: "Interior", price: 1299, available: 15, maxOccupancy: 2 },
      { type: "Ocean View", price: 1599, available: 8, maxOccupancy: 2 },
      { type: "Balcony", price: 1999, available: 5, maxOccupancy: 4 },
      { type: "Suite", price: 2999, available: 2, maxOccupancy: 4 }
    ]
  }
];

export const initialBookings = [];
export const initialUsers = [];
