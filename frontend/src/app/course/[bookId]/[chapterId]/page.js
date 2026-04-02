"use client";
import React, { use, useState } from 'react';
import { BOOKS } from '@/data/courses';
import { useVideoAnalytics, useScrollAnalytics } from '@/hooks/useAnalytics';
import { trackButtonClick, getCompletedChapters, unmarkAsComplete } from '@/lib/analytics';
import Quiz from '@/components/Quiz';
import { ChevronLeft, CheckCircle, Download, HelpCircle, Play, X } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ContentViewer({ params }) {
    const { bookId, chapterId } = use(params);
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return notFound();
    const chapter = book.chapters.find(c => c.id === chapterId);
    if (!chapter) return notFound();

    // Custom Hooks for Analytics
    useScrollAnalytics(chapter.id);

    const [isCompleted, setIsCompleted] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [completedIds, setCompletedIds] = useState([]);

    const fetchProgress = async () => {
        const ids = await getCompletedChapters();
        setCompletedIds(ids);
        setIsCompleted(ids.includes(chapter.id));
    };

    React.useEffect(() => {
        fetchProgress();
    }, [chapter.id]);

    const handleButtonClick = async (label) => {
        if (label === 'Mark as Complete') {
            setIsCompleted(true);
            await trackButtonClick(label, chapter.id);
            await fetchProgress(); // Refresh progress bar
        } else if (label === 'Unmark as Complete') {
            setIsCompleted(false);
            await unmarkAsComplete(chapter.id);
            await fetchProgress(); // Refresh progress bar
        } else {
            if (label === 'Take Quiz') setShowQuiz(true);
            await trackButtonClick(label, chapter.id);
        }
    };

    const bookChapterIds = book.chapters.map(c => c.id);
    const completedInThisBook = completedIds.filter(id => bookChapterIds.includes(id)).length;
    const progressPercent = Math.round((completedInThisBook / book.chapters.length) * 100);

    return (
        <div className="container mx-auto px-4 py-8">
            {showQuiz && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-400/20 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setShowQuiz(false)}
                            className="absolute -top-12 right-0 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <Quiz 
                            quizData={chapter.quiz || []} 
                            contentId={chapter.id} 
                            onClose={() => setShowQuiz(false)} 
                        />
                    </div>
                </div>
            )}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ChevronLeft className="h-6 w-6 text-slate-600" />
                </Link>
                <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{book.title}</span>
                    <h1 className="text-3xl font-bold text-slate-900">{chapter.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {chapter.content.map((item) => (
                        <ContentItem key={item.id} item={item} chapterId={chapter.id} />
                    ))}
                    
                    <div className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                        <button 
                            onClick={() => handleButtonClick(isCompleted ? 'Unmark as Complete' : 'Mark as Complete')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                                isCompleted 
                                ? 'bg-white text-green-600 border-2 border-green-500 hover:bg-red-50 hover:text-red-600 hover:border-red-500 group/btn' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            <CheckCircle className={`h-5 w-5 ${isCompleted ? 'group-hover/btn:hidden' : ''}`} />
                            <X className={`h-5 w-5 hidden ${isCompleted ? 'group-hover/btn:block' : ''}`} />
                            <span className={isCompleted ? 'group-hover/btn:hidden' : ''}>
                                {isCompleted ? 'Completed' : 'Mark as Complete'}
                            </span>
                            <span className={`hidden ${isCompleted ? 'group-hover/btn:block' : ''}`}>
                                Unmark?
                            </span>
                        </button>
                        <button 
                            onClick={() => handleButtonClick('Download Notes')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all hover:shadow-md"
                        >
                            <Download className="h-5 w-5" />
                            Download Notes
                        </button>
                        <button 
                            onClick={() => handleButtonClick('Take Quiz')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all hover:shadow-md"
                        >
                            <HelpCircle className="h-5 w-5" />
                            Take Quiz
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Course Progress</h3>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                                {completedInThisBook} of {book.chapters.length} chapters completed
                            </span>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Chapters in this course</h3>
                            <div className="space-y-3">
                                {book.chapters.map((ch) => (
                                    <Link 
                                        key={ch.id} 
                                        href={`/course/${book.id}/${ch.id}`}
                                        className={`block p-3 rounded-xl text-sm transition-colors ${ch.id === chapter.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        {ch.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContentItem({ item, chapterId }) {
    if (item.type === 'video') {
        const { startTracking, stopTracking } = useVideoAnalytics(item.videoId, chapterId);
        
        return (
            <div className="space-y-4">
                <div 
                    className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-md group"
                    onMouseEnter={startTracking}
                    onMouseLeave={stopTracking}
                >
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`${item.videoUrl}?autoplay=0`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Play className="h-5 w-5 text-blue-600 fill-blue-600" />
                        {item.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">{item.body}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed space-y-4">
                {item.body}
            </div>
        </div>
    );
}
