"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Globe, Mail, Phone } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const channelId = resolvedParams.id;
  const { properties, channels } = useApp();
  
  const [channel, setChannel] = useState<any>(null);
  const [channelProps, setChannelProps] = useState<any[]>([]);
  
  useEffect(() => {
    const chan = channels[channelId];
    if (!chan) return notFound();
    setChannel(chan);
    setChannelProps(properties.filter((p: any) => p.channelId === channelId));
  }, [channelId, properties, channels]);

  if (!channel) return null;

  return (
    <div className="min-h-full bg-[#0f1115]">
      {/* Dynamic Banner */}
      <div className="w-full h-48 md:h-72 relative">
        <Image src={channel.cover} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10 pb-20">
        
        {/* Channel Header Info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#0f1115] overflow-hidden shrink-0 relative bg-black shadow-2xl">
            <Image src={channel.avatar} alt={channel.name} fill className="object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{channel.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-medium mb-4">
              <span>{channel.subscribers.toLocaleString()} subscribers</span>
              <span>•</span>
              <span>{channelProps.length} videos</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-full font-bold transition">
                Subscribe
              </button>
              <button className="bg-[#25D366] text-white hover:bg-[#1ebd5a] px-6 py-2.5 rounded-full font-bold transition flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="glass-panel p-4 rounded-xl hidden xl:flex gap-4">
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition">
              <Globe className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition">
              <Mail className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Bio / About section */}
        <div className="max-w-3xl mb-12">
          <p className="text-gray-300 leading-relaxed text-lg">{channel.bio}</p>
        </div>

        {/* Property Listing Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Properties For Sale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channelProps.map((property: any) => (
              <Link href={`/property/${property.id}`} key={property.id} className="group flex flex-col gap-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <Image 
                  src={property.thumbnailUrl} 
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium">
                  {property.videoDuration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-lg" />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-[15px] line-clamp-2 leading-tight group-hover:text-emerald-400 transition-colors">
                  {property.title}
                </h3>
                <div className="text-sm font-bold text-gray-300 mt-1">
                  {property.curr}{(property.price / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-400">
                  {property.views.toLocaleString()} views • {property.uploadedAt}
                </div>
              </div>
            </Link>
            ))}
            {channelProps.length === 0 && <p className="text-gray-500">No properties available yet.</p>}
          </div>
        </div>
        
      </div>
    </div>
  );
}
