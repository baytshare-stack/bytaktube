"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function MapPage() {
  const { properties } = useApp();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // In a real application, Mapbox GL JS or Google Maps would be used here.
  // We mock the interface using CSS grids and floating elements to simulate the map UX.

  const activeProperty = properties.find(p => p.id === selectedPin);

  return (
    <div className="relative w-full h-full bg-[#111623] overflow-hidden">
      
      {/* Search & Filter Bar Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-auto glass-panel bg-gray-900/80 rounded-full px-6 py-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl">
        <input 
          type="text" 
          placeholder="Search Miami, Beverly Hills..."
          className="bg-transparent border-none text-white focus:outline-none focus:ring-0 w-full md:w-64"
        />
        <div className="hidden md:block w-px h-6 bg-gray-700" />
        <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
          <option value="any">Price (Any)</option>
          <option value="low">Under $1M</option>
          <option value="high">$1M - $5M</option>
          <option value="luxury">$5M+</option>
        </select>
        <div className="hidden md:block w-px h-6 bg-gray-700" />
        <select className="bg-transparent border-none text-white focus:outline-none cursor-pointer">
          <option value="any">Beds (Any)</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
        </select>
      </div>

      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(100%) invert(100%) hue-rotate(180deg) brightness(80%)'
      }} />
      <div className="absolute inset-0 bg-[#0f1115]/30"></div>

      {/* Map Interactive Area (Mocked Pins) */}
      <div className="absolute inset-0 z-10 p-24">
        <div className="w-full h-full relative">
          {properties.filter(p => !!p.location?.lat && !!p.location?.lng).map((property, idx) => (
            <div 
              key={property.id}
              className={`absolute cursor-pointer transition-transform transform ${selectedPin === property.id ? 'scale-125 z-50' : 'hover:scale-110 z-10'}`}
              style={{
                top: `${((90 - property.location.lat) / 180) * 100}%`,
                left: `${((property.location.lng + 180) / 360) * 100}%`
              }}
              onClick={() => setSelectedPin(property.id)}
            >
              <div className={`px-3 py-1.5 rounded-full font-bold shadow-xl border border-white/10 ${selectedPin === property.id ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-emerald-400'}`}>
                {property.curr}{(property.price/1000000).toFixed(1)}M
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Pin Video Preview Card */}
      {activeProperty && (
        <div className="absolute bottom-10 left-10 z-30 w-[340px] glass-panel bg-gray-900/95 rounded-xl overflow-hidden shadow-2xl border border-gray-700 animate-in slide-in-from-bottom-5">
          <div className="relative aspect-video bg-black">
             <Image 
              src={activeProperty.thumbnailUrl} 
              alt={activeProperty.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-lg" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg leading-tight mb-1">{activeProperty.title}</h3>
            <div className="text-emerald-400 font-bold mb-2">{activeProperty.curr}{activeProperty.price.toLocaleString()}</div>
            <div className="flex text-sm text-gray-400 gap-4 mb-4">
              <span>{activeProperty.specs.beds} Beds</span>
              <span>{activeProperty.specs.baths} Baths</span>
              <span>{activeProperty.specs.sqft} SqFt</span>
            </div>
            <Link 
              href={`/property/${activeProperty.id}`}
              className="block w-full text-center bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Play Video Tour
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
