const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analytics`;

// Simple persistent user tagging for session duration or per machine
const getUserId = () => {
    if (typeof window !== 'undefined') {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }
    return 'ssr_user';
};

export const trackButtonClick = async (buttonLabel, contentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                buttonLabel,
                contentId,
                clickedAt: new Date().toISOString()
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to track click:', error);
    }
};

export const trackWatchTime = async (videoId, contentId, watchedSeconds) => {
    try {
        const response = await fetch(`${API_BASE_URL}/watch-time`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                videoId,
                contentId,
                watchedSeconds,
                recordedAt: new Date().toISOString()
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to track watch time:', error);
    }
};

export const trackScrollDepth = async (contentId, maxScrollPercentage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/scroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                contentId,
                maxScrollPercentage,
                recordedAt: new Date().toISOString()
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to track scroll depth:', error);
    }
};

export const trackQuizResult = async (contentId, score, totalQuestions) => {
    try {
        const response = await fetch(`${API_BASE_URL}/quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                contentId,
                score,
                totalQuestions,
                recordedAt: new Date().toISOString()
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to track quiz result:', error);
    }
};

export const getDashboardData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return { success: false };
    }
};

export const getCompletedChapters = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/completed-chapters`, {
            credentials: 'include'
        });
        const result = await response.json();
        return result.success ? result.completedIds : [];
    } catch (error) {
        console.error('Fetch progress error:', error);
        return [];
    }
};

export const unmarkAsComplete = async (contentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/completed-chapters/${contentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return await response.json();
    } catch (error) {
        console.error('Unmark error:', error);
        return { success: false };
    }
};
