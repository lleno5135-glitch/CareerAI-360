const TaskSubmission = require('../models/TaskSubmission');
const TaskEvaluation = require('../models/TaskEvaluation');
const DailyTask = require('../models/DailyTask');
const Challenge = require('../models/Challenge');
const { formatResponse } = require('../utils/helpers');
const AIService = require('../services/aiService');

class SubmissionController {
  // Submit task
  async submitTask(req, res) {
    try {
      const { dailyTaskId, challengeId, submissionType, content, link } = req.body;

      if (!dailyTaskId || !challengeId || !submissionType) {
        return res.status(400).json(formatResponse('error', 'Missing required fields'));
      }

      const submission = new TaskSubmission({
        dailyTaskId,
        challengeId,
        userId: req.userId,
        submissionType,
        content,
        link,
        fileUrl: req.file ? req.file.path : undefined,
        fileName: req.file ? req.file.filename : undefined,
        fileSize: req.file ? req.file.size : undefined,
        fileType: req.file ? req.file.mimetype : undefined
      });

      await submission.save();

      // Update daily task status
      await DailyTask.findByIdAndUpdate(
        dailyTaskId,
        { status: 'submitted', submission: submission._id }
      );

      res.status(201).json(formatResponse('success', 'Task submitted successfully', { submission }));
    } catch (error) {
      console.error('Submit task error:', error);
      res.status(500).json(formatResponse('error', 'Failed to submit task'));
    }
  }

  // Get user submissions
  async getUserSubmissions(req, res) {
    try {
      const { challengeId, page = 1, limit = 10 } = req.query;

      const filter = { userId: req.userId };
      if (challengeId) filter.challengeId = challengeId;

      const skip = (page - 1) * limit;
      const submissions = await TaskSubmission.find(filter)
        .populate('dailyTaskId')
        .populate('evaluation')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ submittedAt: -1 });

      const total = await TaskSubmission.countDocuments(filter);

      res.json(formatResponse('success', 'Submissions retrieved', {
        submissions,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page
        }
      }));
    } catch (error) {
      console.error('Get submissions error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve submissions'));
    }
  }

  // Get submission by ID
  async getSubmissionById(req, res) {
    try {
      const submission = await TaskSubmission.findById(req.params.id)
        .populate('dailyTaskId')
        .populate('evaluation');

      if (!submission) {
        return res.status(404).json(formatResponse('error', 'Submission not found'));
      }

      if (submission.userId.toString() !== req.userId.toString()) {
        return res.status(403).json(formatResponse('error', 'Unauthorized access'));
      }

      res.json(formatResponse('success', 'Submission retrieved', { submission }));
    } catch (error) {
      console.error('Get submission error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve submission'));
    }
  }

  // Evaluate submission (AI)
  async evaluateSubmission(req, res) {
    try {
      const { submissionId } = req.params;

      const submission = await TaskSubmission.findById(submissionId)
        .populate('dailyTaskId')
        .populate('challengeId');

      if (!submission) {
        return res.status(404).json(formatResponse('error', 'Submission not found'));
      }

      // AI evaluation
      const evaluation = await AIService.evaluateTaskSubmission(
        submission.content || submission.fileUrl,
        submission.dailyTaskId,
        submission.challengeId.courseId
      );

      // Create evaluation record
      const evalRecord = new TaskEvaluation({
        submissionId: submission._id,
        dailyTaskId: submission.dailyTaskId._id,
        userId: submission.userId,
        score: evaluation.score,
        feedback: evaluation.feedback,
        codeAnalysis: evaluation.codeAnalysis,
        designAnalysis: evaluation.designAnalysis,
        theoreticalAnalysis: evaluation.theoreticalAnalysis,
        nextSteps: evaluation.nextSteps
      });

      await evalRecord.save();

      // Update submission
      submission.status = 'evaluated';
      submission.evaluation = evalRecord._id;
      await submission.save();

      // Update daily task
      await DailyTask.findByIdAndUpdate(
        submission.dailyTaskId,
        { status: 'evaluated', isCompleted: evaluation.score >= 60 }
      );

      res.json(formatResponse('success', 'Submission evaluated', { evaluation: evalRecord }));
    } catch (error) {
      console.error('Evaluate submission error:', error);
      res.status(500).json(formatResponse('error', 'Failed to evaluate submission'));
    }
  }
}

module.exports = new SubmissionController();
