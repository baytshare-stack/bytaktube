export const MOCK_PROPERTIES = [
  {
    id: "p1",
    title: "Modern Luxury Villa in Downtown",
    price: 2500000,
    curr: "$",
    location: { country: "USA", city: "Los Angeles", neighborhood: "Beverly Hills", lat: 34.0736, lng: -118.4004 },
    specs: { status: "Sale", beds: 4, baths: 3, sqft: 3500, type: "House" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoDuration: "1:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000",
    channelId: "c1",
    description: "Stunning modern architecture featuring open plan living, high ceilings, and panoramic city views. Complete with a pool and smart home systems.",
    views: 12500,
    likes: 800,
    uploadedAt: "2 days ago",
    comments: [] as any[]
  },
  {
    id: "p2",
    title: "Penthouse Suite with Ocean View",
    price: 15000,
    curr: "$",
    location: { country: "USA", city: "Miami", neighborhood: "South Beach", lat: 25.7906, lng: -80.1300 },
    specs: { status: "Rent", beds: 3, baths: 3, sqft: 2800, type: "Apartment" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoDuration: "2:10",
    thumbnailUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    channelId: "c2",
    description: "Ultra luxury penthouse with private elevator access, wrap-around balcony, and direct beach access.",
    views: 24000,
    likes: 1500,
    uploadedAt: "1 week ago",
    comments: [] as any[]
  },
  {
    id: "p3",
    title: "Contemporary Suburban Family Home",
    price: 850000,
    curr: "$",
    location: { country: "USA", city: "Austin", neighborhood: "Round Rock", lat: 30.5083, lng: -97.6789 },
    specs: { status: "Sale", beds: 5, baths: 4, sqft: 3200, type: "House" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoDuration: "3:05",
    thumbnailUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000",
    channelId: "c1",
    description: "Perfect for a growing family. Located in a top school district with a massive backyard and newly renovated kitchen.",
    views: 5400,
    likes: 310,
    uploadedAt: "3 days ago",
    comments: [] as any[]
  },
  {
    id: "p4",
    title: "Charming London Flat",
    price: 3500,
    curr: "£",
    location: { country: "UK", city: "London", neighborhood: "Chelsea", lat: 51.4875, lng: -0.1687 },
    specs: { status: "Rent", beds: 2, baths: 1, sqft: 800, type: "Apartment" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    videoDuration: "1:15",
    thumbnailUrl: "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?auto=format&fit=crop&q=80&w=1000",
    channelId: "c2",
    description: "Beautifully renovated flat with easy access to transport and high street shopping.",
    views: 12000,
    likes: 450,
    uploadedAt: "1 day ago",
    comments: [] as any[]
  }
];

export const MOCK_CHANNELS = {
  "c1": {
    id: "c1",
    name: "Luxury Estates Group",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
    cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1500",
    subscribers: 15400,
    phone: "+1234567890",
    bio: "We specialize in the finest luxury real estate across the country."
  },
  "c2": {
    id: "c2",
    name: "Miami Seaside Realty",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    cover: "https://images.unsplash.com/photo-1533602166946-ebaf9b3236e6?auto=format&fit=crop&q=80&w=1500",
    subscribers: 8200,
    phone: "+1987654321",
    bio: "Your premium gateway to beachfront properties and upscale apartments."
  }
};
