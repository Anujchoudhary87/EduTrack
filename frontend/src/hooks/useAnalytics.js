"use client";
import { useEffect, useRef, useState } from 'react';
import { trackWatchTime, trackScrollDepth } from '@/lib/analytics';

export const useVideoAnalytics = (videoId, contentId) => {
    const watchStartTime = useRef(null);
    const accumulatedSeconds = useRef(0);
    const intervalRef = useRef(null);

    const startTracking = () => {
        if (!watchStartTime.current) {
            watchStartTime.current = Date.now();
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const delta = Math.floor((now - watchStartTime.current) / 1000);
                if (delta >= 10) { // Batch every 10 seconds
                    trackWatchTime(videoId, contentId, delta);
                    watchStartTime.current = now;
                }
            }, 5000); // Check every 5 seconds
        }
    };

    const stopTracking = () => {
        if (watchStartTime.current) {
            const finalDelta = Math.floor((Date.now() - watchStartTime.current) / 1000);
            if (finalDelta > 0) {
                trackWatchTime(videoId, contentId, finalDelta);
            }
            clearInterval(intervalRef.current);
            watchStartTime.current = null;
        }
    };

    useEffect(() => {
        return () => stopTracking();
    }, []);

    return { startTracking, stopTracking };
};

export const useScrollAnalytics = (contentId) => {
    const maxScroll = useRef(0);
    const reportedScroll = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;
            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
            if (scrollPercent > maxScroll.current) {
                maxScroll.current = scrollPercent;
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Report every 30 seconds or on unmount
        const interval = setInterval(() => {
            if (maxScroll.current > reportedScroll.current) {
                trackScrollDepth(contentId, maxScroll.current);
                reportedScroll.current = maxScroll.current;
            }
        }, 30000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
            if (maxScroll.current > reportedScroll.current) {
                trackScrollDepth(contentId, maxScroll.current);
            }
        };
    }, [contentId]);

    return { maxScroll: maxScroll.current };
};
