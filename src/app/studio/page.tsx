"use client";

import { useApp } from "@/context/AppContext";
import { Plus, BarChart2, Video, Inbox, Settings, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { REGIONS } from "@/data/regions";

export default function CreatorStudio() {
  const { currentUser, properties, uploadProperty } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Sale");
  const [price, setPrice] = useState("");
  const [country, setCountry] = useState("Egypt"); // default
  const [city, setCity] = useState("Cairo");
  const [neighborhood, setNeighborhood] = useState("New Cairo");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const myProperties = properties.filter(p => p.channelId === currentUser?.channelId);
  
  const totalViews = myProperties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLikes = myProperties.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = myProperties.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const firstCity = Object.keys(REGIONS[c] || {})[0] || "";
    setCity(firstCity);
    setNeighborhood(REGIONS[c]?.[firstCity]?.[0]?.name || "");
  };

  const handleCityChange = (c: string) => {
    setCity(c);
    setNeighborhood(REGIONS[country]?.[c]?.[0]?.name || "");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.channelId) return;
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Media Files
      const formData = new FormData();
      formData.append("video", videoFile);
      if (thumbFile) {
        formData.append("thumbnail", thumbFile);
      }

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Look up coords
      const regionData = REGIONS[country]?.[city]?.find(n => n.name === neighborhood);
      const lat = regionData?.lat || 0;
      const lng = regionData?.lng || 0;

      // 2. Create Property Metadata
      const newProperty = {
        id: `p_${Date.now()}`,
        title,
        description,
        price: parseInt(price),
        curr: "$", // Can be dynamic based on region
        location: { country, city, neighborhood, lat, lng },
        specs: { status, beds: parseInt(beds), baths: parseInt(baths), sqft: 2000, type: "House" },
        videoUrl: uploadData.videoUrl, // Use REAL uploaded video URL
        videoDuration: "1:00", // Would parse metadata in reality
        thumbnailUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
        channelId: currentUser.channelId,
        views: 0,
        likes: 0,
        uploadedAt: "Just now",
        contact: {
          phone: phone,
          whatsapp: whatsapp
        }
      };

      // 3. Update Global State / LocalStorage
      // @ts-ignore
      uploadProperty(newProperty);
      
      setIsUploading(false);
      setVideoFile(null);
      setThumbFile(null);
      setTitle(""); setDescription(""); setPrice(""); setBeds(""); setBaths(""); setPhone(""); setWhatsapp("");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser?.channelId) {
    return <div className="p-10 text-white font-bold text-center">Create a creator channel first to view your dashboard.</div>;
  }

  return (
    <div className="p-8 pb-20 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Creator Studio</h1>
          <p className="text-gray-400">Manage your real estate video portfolio and analytics.</p>
        </div>
        <button 
          onClick={() => setIsUploading(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Upload New Video
        </button>
      </header>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm font-medium mb-1">Total Views</div>
          <div className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</div>
          <div className="text-emerald-500 text-sm mt-2">All time</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm font-medium mb-1">Total Likes</div>
          <div className="text-3xl font-bold text-white">{totalLikes.toLocaleString()}</div>
          <div className="text-emerald-500 text-sm mt-2">All time</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm font-medium mb-1">Total Comments</div>
          <div className="text-3xl font-bold text-white">{totalComments.toLocaleString()}</div>
          <div className="text-emerald-500 text-sm mt-2">All time</div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-gray-800">
          <div className="text-gray-400 text-sm font-medium mb-1">Subscribers</div>
          <div className="text-3xl font-bold text-white">{(currentUser.channelId ? (channels || {})[currentUser.channelId]?.subscribers?.toLocaleString() : "0") || "0"}</div>
          <div className="text-emerald-500 text-sm mt-2">Channel following</div>
        </div>
      </div>

      {/* Content Management Table */}
      <div className="glass-panel rounded-xl border border-gray-800 overflow-hidden">
        <div className="border-b border-gray-800 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Videos</h2>
          <div className="text-sm text-gray-400">Latest Uploads</div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-[#1a1d24] text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Video Listing</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium">Comments</th>
                <th className="px-6 py-4 font-medium">Likes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {myProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex gap-4 items-center w-80">
                      <div className="w-24 aspect-video relative rounded bg-gray-800 overflow-hidden shrink-0">
                        <Image src={prop.thumbnailUrl} alt={prop.title} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm line-clamp-1">{prop.title}</div>
                        <div className="text-xs text-emerald-400 mt-1">{prop.curr}{(prop.price).toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">Public</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{prop.uploadedAt}</td>
                  <td className="px-6 py-4 text-sm">{prop.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{prop.likes > 0 ? 12 : 0}</td>
                  <td className="px-6 py-4 text-sm">{prop.likes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Property Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#1a1d24] border border-[#2d313a] rounded-2xl w-full max-w-3xl relative shadow-2xl my-8">
            <div className="sticky top-0 bg-[#1a1d24] border-b border-[#2d313a] p-6 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-500" /> Upload Property Video
              </h2>
              <button onClick={() => setIsUploading(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              
              {/* Media Upload Regions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={`border-2 border-dashed ${videoFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 hover:border-emerald-500 hover:bg-white/5'} rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition relative min-h-[200px]`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="video/mp4,video/webm,video/quicktime" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setVideoFile(file);
                    }}
                  />
                  {!videoFile ? (
                    <>
                      <div className="w-14 h-14 bg-gray-800 rounded-full flex flex-col items-center justify-center mb-3 text-emerald-500">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">Property Video *</h3>
                      <p className="text-xs text-gray-400">Vertical (9:16) or horizontal tours.</p>
                      <p className="text-xs text-gray-400 mt-1 mb-2">MP4 or WebM.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-emerald-500 rounded-full flex flex-col items-center justify-center mb-3 text-white">
                        <Video className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-emerald-400 mb-1">Video Selected</h3>
                      <p className="text-xs text-gray-300 font-medium">{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                      <p className="text-[10px] text-gray-500 mt-2">Click to replace</p>
                    </>
                  )}
                </div>

                <div 
                  className={`border-2 border-dashed ${thumbFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 hover:border-emerald-500 hover:bg-white/5'} rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition relative min-h-[200px]`}
                  onClick={() => thumbInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                    ref={thumbInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setThumbFile(file);
                    }}
                  />
                  {!thumbFile ? (
                    <>
                      <div className="w-14 h-14 bg-gray-800 rounded-full flex flex-col items-center justify-center mb-3 text-emerald-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold mb-1">Custom Thumbnail</h3>
                      <p className="text-xs text-gray-400">Optional eye-catching cover.</p>
                      <p className="text-xs text-gray-400 mt-1 mb-2">JPG or PNG.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-emerald-500 rounded-full flex flex-col items-center justify-center mb-3 text-white">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-emerald-400 mb-1">Thumbnail Selected</h3>
                      <p className="text-xs text-gray-300 font-medium">{thumbFile.name} ({(thumbFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                      <p className="text-[10px] text-gray-500 mt-2">Click to replace</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Property Title *</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="e.g. Modern Luxury Villa" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Price *</label>
                  <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="e.g. 2500000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none resize-none" placeholder="Describe the property highlights..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Listing Type</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Bedrooms *</label>
                  <input required type="number" value={beds} onChange={e => setBeds(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="e.g. 4" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Bathrooms *</label>
                  <input required type="number" value={baths} onChange={e => setBaths(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="e.g. 3" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Country *</label>
                  <select required value={country} onChange={e => handleCountryChange(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                    {Object.keys(REGIONS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">City *</label>
                  <select required value={city} onChange={e => handleCityChange(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                    {Object.keys(REGIONS[country] || {}).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Neighborhood/Area *</label>
                  <select required value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="w-full bg-[#0f1115] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer">
                    {(REGIONS[country]?.[city] || []).map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0f1115] p-5 rounded-xl border border-gray-800">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Contact Phone Number *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#1a1d24] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="+1 (234) 567-8900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">WhatsApp Contact Number *</label>
                  <input required type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-[#1a1d24] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none" placeholder="+20 123 456 7890" />
                  <p className="text-xs text-gray-500 mt-1">Country code required (e.g. +20)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-4">
                <button type="button" onClick={() => setIsUploading(false)} disabled={isSubmitting} className="px-6 py-3 font-semibold text-gray-300 hover:text-white transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Publish Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
