// voyages.js
import caribbeanImg from './Images/yacht-sea-sunset.jpg';
import mediterraneanImg from './Images/blue-villa-beautiful-sea-hotel.jpg';
import alaskaImg from './Images/luxurious-cruise-ship.jpg';
import asiaImg from './Images/arborek-island-atoll.jpg';

export const initialVoyages = [
  {
    id: 1,
    title: "Caribbean Paradise",
    description: "7-night cruise visiting exotic Caribbean islands",
    image: caribbeanImg,
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
    title: "Mediterranean Escape",
    description: "10-night luxury cruise through Mediterranean coast",
    image: mediterraneanImg,
    departure: "2025-06-20",
    duration: "10 nights",
    ports: ["Barcelona", "Rome", "Athens", "Istanbul"],
    price: 1899,
    cabins: [
      { type: "Interior", price: 1899, available: 12, maxOccupancy: 2 },
      { type: "Ocean View", price: 2199, available: 10, maxOccupancy: 2 },
      { type: "Balcony", price: 2599, available: 6, maxOccupancy: 4 },
      { type: "Suite", price: 3899, available: 3, maxOccupancy: 4 }
    ]
  },
  {
    id: 3,
    title: "Alaska Wilderness",
    description: "5-night adventure through glaciers and wildlife",
    image: alaskaImg,
    departure: "2025-07-10",
    duration: "5 nights",
    ports: ["Juneau", "Ketchikan", "Sitka", "Glacier Bay"],
    price: 999,
    cabins: [
      { type: "Interior", price: 999, available: 20, maxOccupancy: 2 },
      { type: "Ocean View", price: 1299, available: 15, maxOccupancy: 2 },
      { type: "Balcony", price: 1599, available: 8, maxOccupancy: 4 },
      { type: "Suite", price: 2399, available: 4, maxOccupancy: 4 }
    ]
  },
  {
    id: 4,
    title: "Asia Pacific Explorer",
    description: "14-night journey through Southeast Asia",
    image: asiaImg,
    departure: "2025-09-05",
    duration: "14 nights",
    ports: ["Singapore", "Bangkok", "Ho Chi Minh City", "Hong Kong"],
    price: 2199,
    cabins: [
      { type: "Interior", price: 2199, available: 18, maxOccupancy: 2 },
      { type: "Ocean View", price: 2499, available: 12, maxOccupancy: 2 },
      { type: "Balcony", price: 2999, available: 7, maxOccupancy: 4 },
      { type: "Suite", price: 4299, available: 2, maxOccupancy: 4 }
    ]
  }
];

export const initialBookings = [];
export const initialUsers = [];
