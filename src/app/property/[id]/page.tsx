"use client";

import { use, useState, useEffect } from "react";
import { MOCK_PROPERTIES, MOCK_CHANNELS } from "@/data/mockData";
import Image from "next/image";
import { ThumbsUp, MessageSquare, Share2, BookmarkPlus, Phone, MessageCircle, Facebook, Copy, Send, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const { currentUser, properties, channels, addComment, incrementViews } = useApp();
  
  const [property, setProperty] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // New States
  const [commentText, setCommentText] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const prop = properties.find((p: any) => p.id === propertyId);
    if (!prop) return notFound();
    setProperty(prop);
    setChannel(channels[prop.channelId]);

    // Fast simple mock view counter tracker (runs once per component mount)
    if (!hasViewed && prop) {
      incrementViews(prop.id);
      setHasViewed(true);
    }
  }, [propertyId, properties, channels, incrementViews, hasViewed]);

  if (!property || !channel) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const pageUrl = typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/property/${property.id}`;
  const whatsappMessage = `Hello, I saw this property on the platform and I would like more information.\n\n${pageUrl}`;
  const phone = property.contact?.phone || channel.phone;
  // Clean the number for WhatsApp (remove + or spaces if you want, but wa.me accepts + easily, just strip spaces/dashes)
  const whatsappNumber = (property.contact?.whatsapp || channel.phone).replace(/[\s-()]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col xl:flex-row gap-8">
      {/* Primary Video Column */}
      <div className="flex-1">
        {/* Video Player Mock */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl mb-6 group">
          <video 
            src={property.videoUrl} 
            poster={property.thumbnailUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-2 gap-4">
          {/* Creator Info */}
          <div className="flex items-center gap-4">
            <Link href={`/channel/${channel.id}`} className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative">
              <Image src={channel.avatar} alt={channel.name} fill className="object-cover" />
            </Link>
            <div>
              <Link href={`/channel/${channel.id}`} className="font-semibold text-lg hover:text-emerald-400 block">{channel.name}</Link>
              <div className="text-sm text-gray-400">{channel.subscribers.toLocaleString()} subscribers</div>
            </div>
            <button 
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                isSubscribed ? 'bg-gray-800 text-gray-200' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center gap-2 bg-gray-900 rounded-full p-1 overflow-x-auto">
            <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
              <button 
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
                onClick={() => setIsLiked(!isLiked)}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                <span className="text-sm font-medium">{(property.likes + (isLiked ? 1 : 0)).toLocaleString()}</span>
              </button>
            </div>
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition relative"
                onClick={() => setShowShare(!showShare)}
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              {showShare && (
                <div className="absolute top-12 left-0 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col p-2 gap-1 animate-in slide-in-from-top-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" /> Share to WhatsApp
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition">
                    <Facebook className="w-4 h-4 text-[#1877F2]" /> Share to Facebook
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition">
                    <Send className="w-4 h-4 text-[#0088cc]" /> Share to Telegram
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(pageUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm transition text-left"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition">
              <BookmarkPlus className="w-5 h-5" />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-gray-900 rounded-xl p-4 mt-6">
          <div className="flex gap-4 text-sm font-medium text-gray-300 mb-2">
            <span>{property.views.toLocaleString()} views</span>
            <span>{property.uploadedAt}</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-gray-200">{property.description}</p>
        </div>
        
        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {property.comments?.length || 0} Comments
          </h3>
          
          <form 
            className="flex gap-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!currentUser) return alert("Please sign in to comment");
              if (!commentText.trim()) return;
              addComment(propertyId, {
                id: Date.now().toString(),
                text: commentText,
                user: currentUser.name,
                avatar: currentUser.avatar,
                date: "Just now"
              });
              setCommentText("");
            }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 shrink-0 overflow-hidden relative border border-gray-700">
              {currentUser && <Image src={currentUser.avatar} alt="Me" fill className="object-cover" />}
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 md:items-end">
              <input 
                type="text" 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment..." 
                className="w-full h-10 bg-transparent border-b border-gray-700 focus:border-emerald-500 outline-none text-sm transition-colors"
              />
              <button 
                type="submit" 
                disabled={!commentText.trim()} 
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-bold text-sm transition"
              >
                Comment
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            {(property.comments || []).slice().reverse().map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full shrink-0 relative overflow-hidden bg-gray-800 border border-gray-700">
                  <Image src={comment.avatar} alt={comment.user} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))}
            {(!property.comments || property.comments.length === 0) && (
              <div className="text-center py-8 text-gray-500 text-sm">No comments yet. Be the first to start the conversation!</div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Sidebar Column (Details & Contact) */}
      <div className="xl:w-96 flex flex-col gap-6 shrink-0">
        
        {/* Contact Agents Card */}
        <div className="glass-panel rounded-2xl p-6 border border-gray-800 sticky top-4">
          <div className="text-4xl font-bold text-white mb-1">
            {property.curr}{(property.price).toLocaleString()}
          </div>
          <div className="text-gray-400 mb-6">{property.location.neighborhood}, {property.location.city}</div>
          
          <div className="flex justify-between items-center bg-gray-900 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold">{property.specs.beds}</div>
              <div className="text-xs text-gray-500 uppercase">Beds</div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="text-xl font-bold">{property.specs.baths}</div>
              <div className="text-xs text-gray-500 uppercase">Baths</div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="text-xl font-bold">{property.specs.sqft}</div>
              <div className="text-xs text-gray-500 uppercase">Sq.Ft</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white py-3 rounded-xl font-semibold transition"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              WhatsApp Contact
            </a>
            <a 
              href={`tel:${phone.replace(/[\s-()]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-semibold transition"
            >
              <Phone className="w-5 h-5 fill-current" />
              Call Owner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
