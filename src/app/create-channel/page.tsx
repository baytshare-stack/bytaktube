"use client";

import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function CreateChannel() {
  const { currentUser, createChannel } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  if (!currentUser) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400">Please sign in to create a Creator Channel.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new channel payload
    const newChannelId = `c_${Date.now()}`;
    createChannel({
      id: newChannelId,
      name: name,
      avatar: currentUser.avatar, // In reality, they would upload a new logo
      cover: "https://images.unsplash.com/photo-1541888043621-1317e0b6b23a?auto=format&fit=crop&q=80&w=1500", // Default cover
      subscribers: 0,
      phone: phone,
      bio: bio
    });

    router.push("/studio");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pt-16">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
        <Building2 className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Create Your Channel</h1>
      <p className="text-gray-400 mb-10 text-lg">Start uploading high-quality property videos and capturing leads globally.</p>

      <form onSubmit={handleSubmit} className="bg-[#1a1d24] border border-[#2d313a] rounded-2xl p-8 space-y-6 shadow-xl">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Channel / Agency Name *</label>
          <input 
            required 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none"
            placeholder="e.g. Miami Coast Luxury Real Estate"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Public Contact Phone Number *</label>
          <p className="text-xs text-gray-500 mb-3">This number will be used for direct buyer calls and automated WhatsApp links.</p>
          <input 
            required 
            type="tel" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none"
            placeholder="+1 234 567 8900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Channel Biography</label>
          <textarea 
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none resize-none"
            placeholder="Tell buyers about your expertise, targeted regions, and property types."
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-4"
        >
          Create Channel & Enter Studio
        </button>
      </form>
    </div>
  );
}
