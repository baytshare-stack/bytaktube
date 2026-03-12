"use client";

import { useMemo, useState } from "react";
import { PlayCircle, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { properties, channels } = useApp();

  const [country, setCountry] = useState("All");
  const [city, setCity] = useState("All");
  const [area, setArea] = useState("All");
  const [status, setStatus] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("All");

  const countries = useMemo(() => Array.from(new Set(properties.map((p: any) => p.location.country))), [properties]);
  
  const cities = useMemo(() => {
    let props = properties;
    if (country !== "All") props = props.filter((p: any) => p.location.country === country);
    return Array.from(new Set(props.map((p: any) => p.location.city)));
  }, [country, properties]);

  const areas = useMemo(() => {
    let props = properties;
    if (country !== "All") props = props.filter((p: any) => p.location.country === country);
    if (city !== "All") props = props.filter((p: any) => p.location.city === city);
    return Array.from(new Set(props.map((p: any) => p.location.neighborhood)));
  }, [country, city, properties]);

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setCity("All");
    setArea("All");
  };

  const handleCityChange = (c: string) => {
    setCity(c);
    setArea("All");
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p: any) => {
      if (country !== "All" && p.location.country !== country) return false;
      if (city !== "All" && p.location.city !== city) return false;
      if (area !== "All" && p.location.neighborhood !== area) return false;
      if (status !== "All" && p.specs.status !== status) return false;
      
      const price = p.price;
      if (minPrice && price < parseInt(minPrice)) return false;
      if (maxPrice && price > parseInt(maxPrice)) return false;

      if (beds !== "All") {
        const requiredBeds = parseInt(beds);
        if (beds === "4+" && p.specs.beds < 4) return false;
        if (beds !== "4+" && p.specs.beds !== requiredBeds) return false;
      }

      return true;
    });
  }, [country, city, area, status, minPrice, maxPrice, beds, properties]);

  return (
    <div className="flex flex-col xl:flex-row h-full">
      {/* Animated Filter Sidebar */}
      <div className="group w-full xl:w-20 hover:xl:w-72 transition-all duration-300 ease-out border-r border-[#2d313a] bg-[#1a1d24] shrink-0 h-full hidden xl:block z-50 overflow-hidden relative shadow-2xl">
        {/* Rigid inner container prevents wrapping text during width transition */}
        <div className="w-72 h-full flex flex-col">
          <div className="p-6 flex items-center gap-4 shrink-0 mt-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Search Filters</h2>
          </div>

          <div className="px-6 pb-6 space-y-6 overflow-y-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-1 hide-scrollbar">
            {/* Location */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</h3>
              
              <select 
                className="w-full bg-[#0f1115] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                value={country}
                onChange={e => handleCountryChange(e.target.value)}
              >
                <option value="All">All Countries</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                className="w-full bg-[#0f1115] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                value={city}
                onChange={e => handleCityChange(e.target.value)}
                disabled={country === "All"}
              >
                <option value="All">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                className="w-full bg-[#0f1115] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                value={area}
                onChange={e => setArea(e.target.value)}
                disabled={city === "All"}
              >
                <option value="All">All Areas</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <hr className="border-gray-800" />

            {/* Property Type */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Type</h3>
              <div className="flex gap-2">
                <button 
                  className={`flex-1 flex justify-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${status === 'Sale' ? 'bg-emerald-500 text-white' : 'bg-[#0f1115] text-gray-400 hover:text-white border border-gray-800'}`}
                  onClick={() => setStatus(status === 'Sale' ? 'All' : 'Sale')}
                >
                  For Sale
                </button>
                <button 
                  className={`flex-1 flex justify-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${status === 'Rent' ? 'bg-emerald-500 text-white' : 'bg-[#0f1115] text-gray-400 hover:text-white border border-gray-800'}`}
                  onClick={() => setStatus(status === 'Rent' ? 'All' : 'Rent')}
                >
                  For Rent
                </button>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full bg-[#0f1115] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none placeholder-gray-600"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                />
                <span className="text-gray-600">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full bg-[#0f1115] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none placeholder-gray-600"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Rooms */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {['1', '2', '3', '4+'].map(num => (
                  <button 
                    key={num}
                    className={`flex-1 min-w-[50px] h-[40px] flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${beds === num ? 'bg-emerald-500 text-white' : 'bg-[#0f1115] text-gray-400 hover:text-white border border-gray-800'}`}
                    onClick={() => setBeds(beds === num ? 'All' : num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              className="w-full mt-2 py-3 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition"
              onClick={() => {
                setCountry("All"); setCity("All"); setArea("All"); setStatus("All"); setMinPrice(""); setMaxPrice(""); setBeds("All");
              }}
            >
              Clear Filters
            </button>
            <div className="h-10"></div> {/* Bottom padding */}
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle (Mocked visibility for responsiveness) */}
      <div className="xl:hidden p-4 border-b border-gray-800 bg-[#161920] flex justify-between items-center cursor-pointer">
        <span className="font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-500" /> Filter Results
        </span>
        <span className="text-sm text-gray-500">Tap to expand</span>
      </div>

      {/* Main Feed */}
      <div className="flex-1 p-6 lg:p-10 pb-20 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Discovery Feed <span className="text-gray-500 text-xl font-normal ml-2">({filteredProperties.length})</span></h1>
        </header>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProperties.map((property: any) => {
              const channel = channels[property.channelId];
              if (!channel) return null;
              
              return (
                <Link href={`/property/${property.id}`} key={property.id} className="group flex flex-col gap-4">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-800 shadow-xl">
                    <Image 
                      src={property.thumbnailUrl} 
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-widest uppercase border border-white/10 shadow-lg">
                      For {property.specs.status}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1.5 rounded text-xs font-semibold border border-white/10">
                      {property.videoDuration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-emerald-500/90 rounded-full p-3 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                        <PlayCircle className="w-10 h-10 text-white" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 px-1">
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 relative mt-1 border border-gray-700 shadow-lg">
                      <Image 
                        src={channel.avatar} 
                        alt={channel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                        {property.title}
                      </h3>
                      <div className="text-sm text-gray-400 mt-1 line-clamp-1 font-medium">
                        {property.location.neighborhood}, {property.location.city}
                      </div>
                      <div className="text-[15px] font-bold text-white mt-1.5">
                        {property.curr}{property.price >= 1000000 ? (property.price / 1000000).toFixed(1) + 'M' : property.price.toLocaleString()}
                        {property.specs.status === 'Rent' && <span className="text-sm font-normal text-gray-500 ml-1">/mo</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-2 font-medium flex gap-2 items-center">
                        <span>{property.specs.beds} Beds</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span>{property.specs.baths} Baths</span>
                        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                        <span>{property.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-32 flex flex-col items-center justify-center text-gray-500">
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800">
              <SlidersHorizontal className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">No properties found</h2>
            <p className="text-gray-400 mb-8 max-w-sm text-center">Try adjusting your search filters or clearing them to see more real estate inventory.</p>
            <button 
              className="px-8 py-3 bg-white hover:bg-emerald-500 hover:text-white text-black font-bold rounded-lg transition-colors shadow-xl"
              onClick={() => {
                setCountry("All"); setCity("All"); setArea("All"); setStatus("All"); setMinPrice(""); setMaxPrice(""); setBeds("All");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
