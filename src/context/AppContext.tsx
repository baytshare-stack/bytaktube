"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MOCK_PROPERTIES, MOCK_CHANNELS } from "@/data/mockData";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  channelId?: string | null;
};

export type Property = typeof MOCK_PROPERTIES[0];
export type Channel = typeof MOCK_CHANNELS["c1"];

interface AppState {
  currentUser: User | null;
  properties: Property[];
  channels: Record<string, Channel>;
  login: (method: string, data: any) => void;
  logout: () => void;
  createChannel: (channel: Channel) => void;
  uploadProperty: (property: Property) => void;
  addComment: (propertyId: string, comment: any) => void;
  incrementViews: (propertyId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [channels, setChannels] = useState<Record<string, Channel>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedProps = localStorage.getItem("aura_properties");
    setProperties(savedProps ? JSON.parse(savedProps) : MOCK_PROPERTIES);

    const savedChans = localStorage.getItem("aura_channels");
    setChannels(savedChans ? JSON.parse(savedChans) : MOCK_CHANNELS);

    setIsLoaded(true);
  }, []);

  const login = (method: string, data: any) => {
    const user: User = {
      id: `user_${Date.now()}`,
      name: data.name || "Test User",
      email: data.email || "user@example.com",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
      channelId: null
    };
    
    // Check if we previously had this email and had a channel
    const savedUserStr = localStorage.getItem("aura_user");
    if (savedUserStr) {
      const savedUser = JSON.parse(savedUserStr);
      if (savedUser.email === user.email) {
        user.channelId = savedUser.channelId;
        user.id = savedUser.id;
      }
    }

    setCurrentUser(user);
    localStorage.setItem("aura_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aura_user");
  };

  const createChannel = (channel: Channel) => {
    const newChannels = { ...channels, [channel.id]: channel };
    setChannels(newChannels);
    localStorage.setItem("aura_channels", JSON.stringify(newChannels));

    if (currentUser) {
      const updatedUser = { ...currentUser, channelId: channel.id };
      setCurrentUser(updatedUser);
      localStorage.setItem("aura_user", JSON.stringify(updatedUser));
    }
  };

  const uploadProperty = (property: Property) => {
    const newProps = [property, ...properties];
    setProperties(newProps);
    localStorage.setItem("aura_properties", JSON.stringify(newProps));
  };

  const addComment = (propertyId: string, comment: any) => {
    const newProps = properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, comments: [...(p.comments || []), comment] };
      }
      return p;
    });
    setProperties(newProps);
    localStorage.setItem("aura_properties", JSON.stringify(newProps));
  };

  const incrementViews = (propertyId: string) => {
    const newProps = properties.map(p => {
      if (p.id === propertyId) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });
    setProperties(newProps);
    // Debounce or ignore localStorage sync for views if needed, but for MVP it's fine
    localStorage.setItem("aura_properties", JSON.stringify(newProps));
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <AppContext.Provider value={{ currentUser, properties, channels, login, logout, createChannel, uploadProperty, addComment, incrementViews }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

