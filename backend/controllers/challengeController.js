const Challenge = require('../models/Challenge');
const DailyTask = require('../models/DailyTask');
const { formatResponse, calculateProgress, calculateAverageScore } = require('../utils/helpers');
const AIService = require('../services/aiService');

class ChallengeController {
  // Start new challenge
  async startChallenge(req, res) {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json(formatResponse('error', 'Course ID is required'));
      }

      // Check if user already has active challenge
      const existingChallenge = await Challenge.findOne({
        userId: req.userId,
        courseId,
        status: { $in: ['not_started', 'in_progress'] }
      });

      if (existingChallenge) {
        return res.status(400).json(formatResponse('error', 'You already have an active challenge for this course'));
      }

      // Generate 30-day challenge plan using AI
      // const challengePlan = await AIService.generateChallengePlan({}, 'intermediate');

      // Create challenge
      const challenge = new Challenge({
        userId: req.userId,
        courseId,
        status: 'in_progress',
        currentDay: 1,
        startDate: new Date(),
        estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await challenge.save();

      res.status(201).json(formatResponse('success', 'Challenge started successfully', { challenge }));
    } catch (error) {
      console.error('Start challenge error:', error);
      res.status(500).json(formatResponse('error', 'Failed to start challenge'));
    }
  }

  // Get user challenges
  async getUserChallenges(req, res) {
    try {
      const challenges = await Challenge.find({ userId: req.userId })
        .populate('courseId')
        .populate('dailyTasks')
        .sort({ createdAt: -1 });

      res.json(formatResponse('success', 'Challenges retrieved', { challenges }));
    } catch (error) {
      console.error('Get challenges error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve challenges'));
    }
  }

  // Get challenge by ID
  async getChallengeById(req, res) {
    try {
      const challenge = await Challenge.findById(req.params.id)
        .populate('courseId')
        .populate('dailyTasks')
        .populate('certificateId');

      if (!challenge) {
        return res.status(404).json(formatResponse('error', 'Challenge not found'));
      }

      // Calculate progress
      const progress = calculateProgress(challenge.currentDay, challenge.totalDays);
      const averageScore = calculateAverageScore(challenge.completedDays.map(d => d.score));

      res.json(formatResponse('success', 'Challenge retrieved', {
        challenge,
        stats: {
          progress,
          averageScore,
          daysCompleted: challenge.completedDays.length,
          daysRemaining: challenge.totalDays - challenge.currentDay
        }
      }));
    } catch (error) {
      console.error('Get challenge error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve challenge'));
    }
  }

  // Complete daily task
  async completeDay(req, res) {
    try {
      const { challengeId, score } = req.body;

      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return res.status(404).json(formatResponse('error', 'Challenge not found'));
      }

      // Add completed day
      challenge.completedDays.push({
        day: challenge.currentDay,
        completedAt: new Date(),
        score
      });

      // Update streak
      if (challenge.completedDays.length > 1) {
        const lastDay = challenge.completedDays[challenge.completedDays.length - 2].day;
        if (challenge.currentDay === lastDay + 1) {
          challenge.streakDays++;
        } else {
          challenge.streakDays = 1;
        }
      } else {
        challenge.streakDays = 1;
      }

      // Move to next day or complete challenge
      if (challenge.currentDay < challenge.totalDays) {
        challenge.currentDay++;
      } else {
        challenge.status = 'completed';
        challenge.completedDate = new Date();
      }

      // Update average score
      const scores = challenge.completedDays.map(d => d.score);
      challenge.totalScore = scores.reduce((a, b) => a + b, 0);
      challenge.averageScore = Math.round(challenge.totalScore / scores.length);

      await challenge.save();

      res.json(formatResponse('success', 'Day completed successfully', { challenge }));
    } catch (error) {
      console.error('Complete day error:', error);
      res.status(500).json(formatResponse('error', 'Failed to complete day'));
    }
  }
}

module.exports = new ChallengeController();
