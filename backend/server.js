const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || '*');
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(); // Allow anonymous if token is missing (optional)

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    next();
  } catch (error) {
    console.error('Auth error:', error);
    next();
  }
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });
    res.status(201).json({ success: true, message: 'User created' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'User already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  if (!req.user) return res.status(401).json({ success: false });
  res.json({ success: true, user: { id: req.user.id, email: req.user.email, name: req.user.name } });
});

// --- ANALYTICS ROUTES ---

app.post('/api/analytics/click', authenticate, async (req, res) => {
  const { buttonLabel, contentId, clickedAt } = req.body;
  const userId = req.user ? req.user.id : req.body.userId; // Fallback to body userId for guests

  try {
    const click = await prisma.buttonClick.create({
      data: {
        userId,
        buttonLabel,
        contentId,
        clickedAt: clickedAt ? new Date(clickedAt) : undefined,
      },
    });
    res.status(201).json({ success: true, data: click });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/analytics/watch-time', authenticate, async (req, res) => {
  const { videoId, contentId, watchedSeconds, recordedAt } = req.body;
  const userId = req.user ? req.user.id : req.body.userId;

  try {
    const watchTime = await prisma.videoWatchTime.create({
      data: {
        userId,
        videoId,
        contentId,
        watchedSeconds,
        recordedAt: recordedAt ? new Date(recordedAt) : undefined,
      },
    });
    res.status(201).json({ success: true, data: watchTime });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/analytics/scroll', authenticate, async (req, res) => {
  const { contentId, maxScrollPercentage, recordedAt } = req.body;
  const userId = req.user ? req.user.id : req.body.userId;

  if (maxScrollPercentage < 0 || maxScrollPercentage > 100) {
    return res.status(400).json({ success: false, error: 'Invalid scroll percentage' });
  }

  try {
    const scroll = await prisma.scrollDepth.create({
      data: {
        userId,
        contentId,
        maxScrollPercentage,
        recordedAt: recordedAt ? new Date(recordedAt) : undefined,
      },
    });
    res.status(201).json({ success: true, data: scroll });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/analytics/quiz', authenticate, async (req, res) => {
  const { contentId, score, totalQuestions, recordedAt } = req.body;
  const userId = req.user ? req.user.id : req.body.userId;

  try {
    const quiz = await prisma.quizResult.create({
      data: {
        userId,
        contentId,
        score,
        totalQuestions,
        recordedAt: recordedAt ? new Date(recordedAt) : undefined,
      },
    });
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/analytics/dashboard', authenticate, async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user.id } : {};

    const clicks = await prisma.buttonClick.groupBy({
      by: ['buttonLabel', 'contentId'],
      where: filter,
      _count: { id: true },
    });

    const watchTimes = await prisma.videoWatchTime.groupBy({
      by: ['videoId', 'contentId'],
      where: filter,
      _sum: { watchedSeconds: true },
      _avg: { watchedSeconds: true },
    });

    // For simplicity, showing aggregate if guest, or user-specific if logged in
    const scrollDepths = await prisma.scrollDepth.groupBy({
      by: ['contentId'],
      where: filter,
      _avg: { maxScrollPercentage: true },
      _count: { id: true }
    });

    const quizScores = await prisma.quizResult.groupBy({
      by: ['contentId'],
      where: filter,
      _avg: { score: true },
      _count: { id: true }
    });

    res.json({
      success: true,
      data: {
        clicks,
        watchTimes: watchTimes.map(w => ({
          videoId: w.videoId,
          contentId: w.contentId,
          totalSeconds: w._sum.watchedSeconds,
          averageSecondsPerUser: w._avg.watchedSeconds // Simplified for this view
        })),
        scrollDepths,
        quizzes: quizScores.map(q => ({
          contentId: q.contentId,
          averageScore: q._avg.score,
          attemptCount: q._count.id
        }))
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/analytics/completed-chapters', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    const completions = await prisma.buttonClick.findMany({
      where: {
        userId: req.user.id,
        buttonLabel: 'Mark as Complete'
      },
      select: {
        contentId: true
      },
      distinct: ['contentId']
    });

    const completedIds = completions.map(c => c.contentId);
    res.json({ success: true, completedIds });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/api/analytics/completed-chapters/:contentId', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    await prisma.buttonClick.deleteMany({
      where: {
        userId: req.user.id,
        contentId: req.params.contentId,
        buttonLabel: 'Mark as Complete'
      }
    });

    res.json({ success: true, message: 'Unmarked as complete' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Analytics Server running on port ${PORT}`);
});
