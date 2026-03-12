"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, BookmarkPlus, MapPin, Bed, Bath, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function ShortsFeed() {
  const { properties, channels } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  // In a real app, we'd use IntersectionObserver to snap and auto-play
  const property = properties[activeIndex];
  if (!property) return <div className="h-full w-full bg-black flex justify-center items-center text-white">No properties available</div>;
  const channel = channels[property.channelId];

  return (
    <div className="h-full w-full bg-black flex justify-center items-center overflow-hidden relative">
      <div className="relative h-full w-full max-w-lg bg-gray-900 mx-auto aspect-[9/16] md:h-[90vh] md:rounded-2xl md:my-auto overflow-hidden shadow-2xl">
        
        {/* Full Screen Video Mock */}
        <video 
          src={property.videoUrl} 
          poster={property.thumbnailUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Left Info Overlay */}
        <div className="absolute bottom-6 left-6 right-20 z-10 flex flex-col gap-3">
          <Link href={`/property/${property.id}`} className="hover:opacity-80 transition-opacity">
            <h2 className="text-3xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
              {property.curr}{(property.price / 1000).toLocaleString()}k
            </h2>
            <div className="flex items-center gap-1 text-gray-200 mt-1 drop-shadow-md">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">{property.location.neighborhood}, {property.location.city}</span>
            </div>
            <div className="flex gap-4 mt-2 text-sm font-medium text-gray-300 drop-shadow-md">
              <div className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.specs.beds} Beds</div>
              <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.specs.baths} Baths</div>
            </div>
          </Link>
          <p className="text-sm text-gray-300 line-clamp-2 mt-2 drop-shadow-md md:w-[80%]">
            {property.title} - {property.description}
          </p>
        </div>

        {/* Right Interaction Column */}
        <div className="absolute bottom-6 right-4 z-10 flex flex-col items-center gap-6">
          
          <Link href={`/channel/${channel.id}`} className="relative group mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden relative bg-black">
              <Image src={channel.avatar} alt={channel.name} fill className="object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-transparent group-hover:bg-emerald-400 transition cursor-pointer">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </Link>

          <div className="flex flex-col items-center gap-1 group cursor-pointer transition">
            <div className="bg-black/40 group-hover:bg-black/60 p-3 rounded-full backdrop-blur-sm">
              <Heart className="w-7 h-7 text-white group-hover:fill-emerald-500 group-hover:text-emerald-500 transition-colors" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">{property.likes > 1000 ? `${(property.likes/1000).toFixed(1)}k` : property.likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="bg-black/40 group-hover:bg-black/60 p-3 rounded-full backdrop-blur-sm transition">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">24</span>
          </div>

          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="bg-black/40 group-hover:bg-black/60 p-3 rounded-full backdrop-blur-sm transition">
              <BookmarkPlus className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">Save</span>
          </div>

          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <div className="bg-black/40 group-hover:bg-black/60 p-3 rounded-full backdrop-blur-sm transition">
              <Share2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
          </div>
        </div>

      </div>
    </div>
  );
}
