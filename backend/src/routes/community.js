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

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const { page = 1, limit = 10, language, isAnswered } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (language) where.language = language;
    if (isAnswered !== undefined) where.isAnswered = isAnswered === 'true';

    const questions = await prisma.question.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        content: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.question.count({ where });

    res.json({
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions' 
    });
  }
});

// Create question
router.post('/questions', authenticateUser, [
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

    const question = await prisma.question.create({
      data: {
        userId,
        title,
        content,
        language,
        contentId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Question created successfully',
      question
    });

  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ 
      error: 'Failed to create question' 
    });
  }
});

// Get question by ID
router.get('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        content: {
          select: {
            id: true,
            title: true
          }
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!question) {
      return res.status(404).json({ 
        error: 'Question not found' 
      });
    }

    res.json({ question });

  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch question' 
    });
  }
});

// Create answer
router.post('/questions/:id/answers', authenticateUser, [
  body('content').notEmpty()
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
    const { id: questionId } = req.params;
    const { content } = req.body;

    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId,
        content
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Update question as answered
    await prisma.question.update({
      where: { id: questionId },
      data: { isAnswered: true }
    });

    res.status(201).json({
      message: 'Answer created successfully',
      answer
    });

  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ 
      error: 'Failed to create answer' 
    });
  }
});

// Get study groups
router.get('/study-groups', async (req, res) => {
  try {
    const { page = 1, limit = 10, language } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isPrivate: false };
    if (language) where.language = language;

    const studyGroups = await prisma.studyGroup.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.studyGroup.count({ where });

    res.json({
      studyGroups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get study groups error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch study groups' 
    });
  }
});

// Create study group
router.post('/study-groups', authenticateUser, [
  body('name').notEmpty(),
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
    const { name, description, language, maxMembers, isPrivate } = req.body;

    const studyGroup = await prisma.studyGroup.create({
      data: {
        name,
        description,
        language,
        maxMembers: maxMembers || 10,
        isPrivate: isPrivate || false,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Study group created successfully',
      studyGroup
    });

  } catch (error) {
    console.error('Create study group error:', error);
    res.status(500).json({ 
      error: 'Failed to create study group' 
    });
  }
});

// Join study group
router.post('/study-groups/:id/join', authenticateUser, async (req, res) => {
  try {
    const { userId } = req;
    const { id: studyGroupId } = req.params;

    // Check if group exists and has space
    const studyGroup = await prisma.studyGroup.findUnique({
      where: { id: studyGroupId },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    if (!studyGroup) {
      return res.status(404).json({ 
        error: 'Study group not found' 
      });
    }

    if (studyGroup._count.members >= studyGroup.maxMembers) {
      return res.status(400).json({ 
        error: 'Study group is full' 
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.studyGroupMember.findUnique({
      where: {
        studyGroupId_userId: {
          studyGroupId,
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ 
        error: 'Already a member of this study group' 
      });
    }

    const member = await prisma.studyGroupMember.create({
      data: {
        studyGroupId,
        userId,
        role: 'MEMBER'
      }
    });

    res.json({
      message: 'Joined study group successfully',
      member
    });

  } catch (error) {
    console.error('Join study group error:', error);
    res.status(500).json({ 
      error: 'Failed to join study group' 
    });
  }
});

module.exports = router; 