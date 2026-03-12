"use client";

import Link from "next/link";
import { Home, Map, Sparkles, BookmarkPlus, PlusCircle, Search, LogOut, User as UserIcon, LogIn, Globe } from "lucide-react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { AuthModal } from "./AuthModal";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const { t, language, toggleLanguage } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="w-64 h-full border-r border-[#2d313a] bg-[#1a1d24] flex flex-col p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-10 px-2 mt-4">
          <Sparkles className="w-8 h-8 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight">Aura Estates</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <Link href="/" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${pathname === '/' ? 'bg-white/10 text-emerald-400 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
            <Home className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-medium">{t("home")}</span>
          </Link>
          <Link href="/map" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${pathname === '/map' ? 'bg-white/10 text-emerald-400 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
            <Map className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-medium">{t("map")}</span>
          </Link>
          <Link href="/shorts" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${pathname === '/shorts' ? 'bg-white/10 text-emerald-400 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
            <Sparkles className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-medium">{t("shorts")}</span>
          </Link>
          <Link href="/saved" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition ${pathname === '/saved' ? 'bg-white/10 text-emerald-400 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
            <BookmarkPlus className="w-6 h-6 shrink-0" />
            <span className="hidden md:block font-medium">{t("saved")}</span>
          </Link>
          
          <hr className="border-[#2d313a] my-4" />
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
          
          {currentUser ? (
            // Logged in state
            <>
              <div 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gray-800 text-emerald-400 border border-emerald-500/30 mb-2 cursor-pointer transition hover:bg-gray-700"
                title={t("clickToLogout")}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative bg-emerald-500 border border-gray-600">
                  <Image src={currentUser.avatar} alt="Avatar" fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-bold text-sm leading-tight text-white truncate">{currentUser.name}</span>
                  <span className="text-xs text-gray-400 leading-tight">{t("clickToLogout")}</span>
                </div>
                <LogOut className="w-4 h-4 text-gray-400" />
              </div>

              {currentUser.channelId ? (
                // Agent with a channel
                <>
                  <Link href={`/channel/${currentUser.channelId}`} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition-colors">
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium">{t("yourChannel")}</span>
                  </Link>
                  <Link href="/studio" className="flex items-center gap-3 px-3 py-3 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium">{t("creatorStudio")}</span>
                  </Link>
                </>
              ) : (
                // Normal buyer, prompt to make channel
                <Link href="/create-channel" className="flex items-center gap-3 px-3 py-3 rounded-lg border border-dashed border-gray-600 hover:border-emerald-500 hover:text-emerald-400 transition-colors text-gray-400 mt-2">
                  <span className="font-medium text-sm text-center w-full">{t("createAgentChannel")}</span>
                </Link>
              )}
            </>
          ) : (
            // Logged out state
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-3 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 w-full justify-center md:justify-start"
            >
              <LogIn className="w-5 h-5" />
              <span className="hidden md:block">{t("signIn")}</span>
            </button>
          )}

          <button 
              onClick={toggleLanguage}
              className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1d24] text-gray-400 hover:text-white border border-gray-800 hover:border-emerald-500 rounded-xl transition w-full"
            >
              <Globe className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm font-semibold">{language === 'en' ? 'عربي' : 'English'}</span>
          </button>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
