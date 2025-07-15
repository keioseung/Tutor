const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all published contents with translations
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      difficulty, 
      language = 'KOREAN',
      search 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      isPublished: true,
      ...(category && { category }),
      ...(difficulty && { difficulty })
    };

    // Add search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { translations: { some: { title: { contains: search, mode: 'insensitive' } } } }
      ];
    }

    const contents = await prisma.content.findMany({
      where,
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            title: true,
            content: true,
            summary: true
          }
        },
        _count: {
          select: {
            learningProgress: true,
            favorites: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.content.count({ where });

    res.json({
      contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch contents' 
    });
  }
});

// Get daily contents (3 per day)
router.get('/daily', async (req, res) => {
  try {
    const { language = 'KOREAN' } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const contents = await prisma.content.findMany({
      where: {
        isPublished: true,
        publishedAt: {
          gte: today
        }
      },
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            title: true,
            content: true,
            summary: true
          }
        }
      },
      orderBy: { publishedAt: 'asc' },
      take: 3
    });

    res.json({ contents });

  } catch (error) {
    console.error('Get daily contents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch daily contents' 
    });
  }
});

// Get single content by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'KOREAN' } = req.query;

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            title: true,
            content: true,
            summary: true
          }
        },
        _count: {
          select: {
            learningProgress: true,
            favorites: true,
            questions: true
          }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ 
        error: 'Content not found' 
      });
    }

    res.json({ content });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content' 
    });
  }
});

// Get content in multiple languages
router.get('/:id/translations', async (req, res) => {
  try {
    const { id } = req.params;

    const content = await prisma.content.findUnique({
      where: { id },
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
    });

    if (!content) {
      return res.status(404).json({ 
        error: 'Content not found' 
      });
    }

    res.json({ content });

  } catch (error) {
    console.error('Get content translations error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content translations' 
    });
  }
});

// Search contents
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { language = 'KOREAN', page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contents = await prisma.content.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { translations: { some: { title: { contains: query, mode: 'insensitive' } } } },
          { translations: { some: { content: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            title: true,
            content: true,
            summary: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.content.count({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { translations: { some: { title: { contains: query, mode: 'insensitive' } } } },
          { translations: { some: { content: { contains: query, mode: 'insensitive' } } } }
        ]
      }
    });

    res.json({
      contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Search contents error:', error);
    res.status(500).json({ 
      error: 'Failed to search contents' 
    });
  }
});

// Get content categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.content.groupBy({
      by: ['category'],
      where: { isPublished: true },
      _count: { category: true }
    });

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories' 
    });
  }
});

// Get popular contents
router.get('/popular/list', async (req, res) => {
  try {
    const { language = 'KOREAN', limit = 10 } = req.query;

    const contents = await prisma.content.findMany({
      where: { isPublished: true },
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            title: true,
            content: true,
            summary: true
          }
        },
        _count: {
          select: {
            learningProgress: true,
            favorites: true
          }
        }
      },
      orderBy: [
        { favorites: { _count: 'desc' } },
        { learningProgress: { _count: 'desc' } }
      ],
      take: parseInt(limit)
    });

    res.json({ contents });

  } catch (error) {
    console.error('Get popular contents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular contents' 
    });
  }
});

module.exports = router; 