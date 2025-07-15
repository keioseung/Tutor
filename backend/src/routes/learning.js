const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to get user from token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
};

// Get user's learning progress
router.get('/progress', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const progress = await prisma.learningProgress.findMany({
      where: { userId },
      include: {
        content: {
          include: {
            translations: {
              select: {
                id: true,
                language: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.learningProgress.count({ where: { userId } });

    res.json({
      progress,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get learning progress error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch learning progress' 
    });
  }
});

// Update learning progress
router.post('/progress/:contentId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { contentId } = req.params;
    const { status, timeSpent } = req.body;

    const progress = await prisma.learningProgress.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId
        }
      },
      update: {
        status,
        timeSpent: timeSpent || 0,
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      },
      create: {
        userId,
        contentId,
        status,
        timeSpent: timeSpent || 0,
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });

    res.json({
      message: 'Learning progress updated',
      progress
    });

  } catch (error) {
    console.error('Update learning progress error:', error);
    res.status(500).json({ 
      error: 'Failed to update learning progress' 
    });
  }
});

// Get user's favorites
router.get('/favorites', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        content: {
          include: {
            translations: {
              select: {
                id: true,
                language: true,
                title: true,
                content: true,
                summary: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.favorite.count({ where: { userId } });

    res.json({
      favorites,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch favorites' 
    });
  }
});

// Add/Remove favorite
router.post('/favorites/:contentId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { contentId } = req.params;

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_contentId: {
          userId,
          contentId
        }
      }
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      res.json({
        message: 'Removed from favorites',
        isFavorite: false
      });
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          contentId
        }
      });

      res.json({
        message: 'Added to favorites',
        isFavorite: true
      });
    }

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle favorite' 
    });
  }
});

// Get user's vocabulary
router.get('/vocabulary', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 20, language, isLearned } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId };
    if (language) where.language = language;
    if (isLearned !== undefined) where.isLearned = isLearned === 'true';

    const vocabulary = await prisma.vocabulary.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.vocabulary.count({ where });

    res.json({
      vocabulary,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get vocabulary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vocabulary' 
    });
  }
});

// Add vocabulary
router.post('/vocabulary', authenticateUser, [
  body('word').notEmpty(),
  body('meaning').notEmpty(),
  body('language').isIn(['KOREAN', 'ENGLISH', 'JAPANESE', 'CHINESE'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { userId } = req;
    const { word, meaning, language } = req.body;

    const vocabulary = await prisma.vocabulary.create({
      data: {
        userId,
        word,
        meaning,
        language
      }
    });

    res.status(201).json({
      message: 'Vocabulary added',
      vocabulary
    });

  } catch (error) {
    console.error('Add vocabulary error:', error);
    res.status(500).json({ 
      error: 'Failed to add vocabulary' 
    });
  }
});

// Update vocabulary (mark as learned)
router.put('/vocabulary/:id', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { isLearned } = req.body;

    const vocabulary = await prisma.vocabulary.updateMany({
      where: {
        id,
        userId
      },
      data: {
        isLearned
      }
    });

    res.json({
      message: 'Vocabulary updated',
      vocabulary
    });

  } catch (error) {
    console.error('Update vocabulary error:', error);
    res.status(500).json({ 
      error: 'Failed to update vocabulary' 
    });
  }
});

// Get user's notes
router.get('/notes', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, contentId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId };
    if (contentId) where.contentId = contentId;

    const notes = await prisma.note.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.note.count({ where });

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notes' 
    });
  }
});

// Add note
router.post('/notes', authenticateUser, [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('language').isIn(['KOREAN', 'ENGLISH', 'JAPANESE', 'CHINESE'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { userId } = req;
    const { title, content, language, contentId } = req.body;

    const note = await prisma.note.create({
      data: {
        userId,
        title,
        content,
        language,
        contentId
      }
    });

    res.status(201).json({
      message: 'Note added',
      note
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ 
      error: 'Failed to add note' 
    });
  }
});

// Get learning statistics
router.get('/statistics', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;

    const [
      totalProgress,
      completedContent,
      totalFavorites,
      totalVocabulary,
      totalNotes,
      totalTimeSpent
    ] = await Promise.all([
      prisma.learningProgress.count({ where: { userId } }),
      prisma.learningProgress.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.vocabulary.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.learningProgress.aggregate({
        where: { userId },
        _sum: { timeSpent: true }
      })
    ]);

    const statistics = {
      totalProgress,
      completedContent,
      totalFavorites,
      totalVocabulary,
      totalNotes,
      totalTimeSpent: totalTimeSpent._sum.timeSpent || 0,
      completionRate: totalProgress > 0 ? (completedContent / totalProgress) * 100 : 0
    };

    res.json({ statistics });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics' 
    });
  }
});

module.exports = router; 