"use client";
import Link from "next/link";
import { BookOpen, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <BookOpen className="h-6 w-6" />
          <span>EduTrack</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Courses
          </Link>
          <Link href="/analytics" className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 transition-colors">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {loading ? (
             <div className="h-8 w-8 bg-slate-100 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="hidden sm:inline">{user.name || user.email}</span>
               </div>
               <button 
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
               >
                 <LogOut className="h-5 w-5" />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                Log in
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
