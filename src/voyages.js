// voyages.js
export const initialVoyages = [
  {
    id: 1,
    title: "Caribbean Paradise",
    description: "7-night cruise visiting exotic Caribbean islands",
    image: "/images/caribbean.jpg",
    departure: "2023-12-15",
    duration: "7 nights",
    ports: ["Miami", "Nassau", "St. Thomas", "San Juan"],
    price: 1299,
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
