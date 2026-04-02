"use client";
import Link from 'next/link';
import { BOOKS } from '@/data/courses';
import { Book, ChevronRight, Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full"></div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 text-blue-700 rounded-full text-sm font-bold mb-8 animate-bounce shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>New content added weekly</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 max-w-4xl leading-tight">
          Master Modern Tech with <span className="text-blue-600">Structured Paths</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
          Join thousands of learners on the world's most interactive analytics-driven learning platform. Track every click, watch, and scroll.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/register" 
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="flex-1 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Sign In
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale">
          <div className="flex flex-col items-center gap-2">
             <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
             <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
             <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
             <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
             <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Welcome back, <span className="text-blue-600">{user.name || 'Student'}</span>
          </h1>
          <p className="text-lg text-slate-600">
            Pick up where you left off or start a new learning journey today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BOOKS.map((book) => (
          <div key={book.id} className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Book className="h-16 w-16 text-white/90" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {book.title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm line-clamp-2">
                {book.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {book.chapters.length} Chapters
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    4.9
                  </span>
                </div>
                <Link
                  href={`/course/${book.id}/${book.chapters[0].id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  Start Learning
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
