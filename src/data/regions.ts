export type RegionItem = { name: string; lat: number; lng: number };
export type RegionCity = Record<string, RegionItem[]>;
export type RegionCountry = Record<string, RegionCity>;

// Coordinates are roughly around the actual visual map centers to show varied distribution
export const REGIONS: RegionCountry = {
  "Egypt": {
    "Cairo": [
      { name: "New Cairo", lat: 30.03, lng: 31.48 },
      { name: "Maadi", lat: 29.96, lng: 31.27 },
      { name: "Zamalek", lat: 30.06, lng: 31.22 },
      { name: "Heliopolis", lat: 30.10, lng: 31.33 },
      { name: "Nasr City", lat: 30.05, lng: 31.33 },
      { name: "Sheikh Zayed", lat: 30.04, lng: 30.98 }
    ],
    "Alexandria": [
      { name: "Smouha", lat: 31.21, lng: 29.95 },
      { name: "Glym", lat: 31.24, lng: 29.97 },
      { name: "Roushdy", lat: 31.24, lng: 29.95 },
      { name: "Sidi Gaber", lat: 31.22, lng: 29.94 },
      { name: "Montaza", lat: 31.28, lng: 30.02 }
    ],
    "Giza": [
      { name: "Dokki", lat: 30.03, lng: 31.20 },
      { name: "Mohandiseen", lat: 30.05, lng: 31.20 },
      { name: "Agouza", lat: 30.04, lng: 31.21 },
      { name: "6th of October", lat: 29.97, lng: 30.93 }
    ]
  },
  "USA": {
    "California": [
      { name: "Beverly Hills", lat: 34.07, lng: -118.40 },
      { name: "Santa Monica", lat: 34.01, lng: -118.49 },
      { name: "Hollywood", lat: 34.09, lng: -118.32 },
      { name: "Malibu", lat: 34.02, lng: -118.77 }
    ],
    "New York": [
      { name: "Manhattan", lat: 40.78, lng: -73.97 },
      { name: "Brooklyn", lat: 40.67, lng: -73.94 },
      { name: "Queens", lat: 40.72, lng: -73.84 },
      { name: "The Bronx", lat: 40.84, lng: -73.86 }
    ],
    "Florida": [
      { name: "Miami Beach", lat: 25.81, lng: -80.12 },
      { name: "Brickell", lat: 25.75, lng: -80.19 },
      { name: "Coral Gables", lat: 25.72, lng: -80.26 },
      { name: "Orlando", lat: 28.53, lng: -81.37 }
    ]
  },
  "UAE": {
    "Dubai": [
      { name: "Downtown Dubai", lat: 25.19, lng: 55.27 },
      { name: "Dubai Marina", lat: 25.08, lng: 55.14 },
      { name: "Palm Jumeirah", lat: 25.11, lng: 55.13 },
      { name: "JLT", lat: 25.07, lng: 55.14 },
      { name: "Business Bay", lat: 25.18, lng: 55.26 }
    ],
    "Abu Dhabi": [
      { name: "Al Reem Island", lat: 24.49, lng: 54.40 },
      { name: "Yas Island", lat: 24.46, lng: 54.60 },
      { name: "Saadiyat Island", lat: 24.53, lng: 54.43 }
    ]
  },
  "UK": {
    "London": [
      { name: "Chelsea", lat: 51.48, lng: -0.16 },
      { name: "Kensington", lat: 51.50, lng: -0.19 },
      { name: "Mayfair", lat: 51.51, lng: -0.14 },
      { name: "Notting Hill", lat: 51.51, lng: -0.20 },
      { name: "Camden", lat: 51.54, lng: -0.14 }
    ],
    "Manchester": [
      { name: "Deansgate", lat: 53.47, lng: -2.25 },
      { name: "Spinningfields", lat: 53.48, lng: -2.25 },
      { name: "Salford Quays", lat: 53.47, lng: -2.28 }
    ]
  }
};
