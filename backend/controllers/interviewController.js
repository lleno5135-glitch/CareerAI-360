const Interview = require('../models/Interview');
const InterviewQuestion = require('../models/InterviewQuestion');
const InterviewAnswer = require('../models/InterviewAnswer');
const Resume = require('../models/Resume');
const Challenge = require('../models/Challenge');
const { formatResponse } = require('../utils/helpers');
const AIService = require('../services/aiService');

class InterviewController {
  // Start interview
  async startInterview(req, res) {
    try {
      const { courseId, resumeId, interviewType = 'mock', rounds = 'full' } = req.body;

      if (!courseId) {
        return res.status(400).json(formatResponse('error', 'Course ID is required'));
      }

      // Create interview record
      const interview = new Interview({
        userId: req.userId,
        courseId,
        resumeId,
        interviewType,
        rounds,
        status: 'in_progress',
        startedAt: new Date()
      });

      await interview.save();

      // Generate initial questions
      const userProfile = {}; // TODO: Fetch from DB
      const questions = await AIService.generateInterviewQuestions(
        userProfile,
        { _id: courseId },
        resumeId ? { _id: resumeId } : null
      );

      // Create question records
      const questionRecords = await InterviewQuestion.insertMany(
        questions.map((q, i) => ({
          interviewId: interview._id,
          questionNumber: i + 1,
          category: q.category,
          question: q.question,
          context: q.context,
          difficulty: q.difficulty
        }))
      );

      interview.questions = questionRecords.map(q => q._id);
      await interview.save();

      res.status(201).json(formatResponse('success', 'Interview started', {
        interview,
        questions: questionRecords
      }));
    } catch (error) {
      console.error('Start interview error:', error);
      res.status(500).json(formatResponse('error', 'Failed to start interview'));
    }
  }

  // Submit interview answer
  async submitAnswer(req, res) {
    try {
      const { interviewId, questionId, answerText, transcription, duration } = req.body;

      if (!interviewId || !questionId || !answerText) {
        return res.status(400).json(formatResponse('error', 'Missing required fields'));
      }

      // Create answer record
      const answer = new InterviewAnswer({
        interviewId,
        questionId,
        answerText,
        transcription,
        duration,
        recordedAt: new Date()
      });

      await answer.save();

      // AI Analysis
      const question = await InterviewQuestion.findById(questionId);
      const interview = await Interview.findById(interviewId);
      const analysis = await AIService.analyzeInterviewAnswer(
        answerText,
        question,
        {},
        { _id: interview.courseId }
      );

      // Update answer with analysis
      answer.score = analysis.score;
      answer.feedback = analysis.feedback;
      answer.aiAnalysis = analysis.aiAnalysis;
      answer.analyzedAt = new Date();
      await answer.save();

      // Generate next question
      const nextQuestion = await AIService.generateAdaptiveQuestion(
        analysis.score,
        analysis.feedback.relevanceScore,
        { _id: interview.courseId },
        { questionCount: interview.questions.length + 1 }
      );

      const nextQuestionRecord = new InterviewQuestion({
        interviewId,
        questionNumber: interview.questions.length + 1,
        category: nextQuestion.category,
        question: nextQuestion.question,
        difficulty: nextQuestion.difficulty,
        adaptivityLevel: nextQuestion.adaptivityLevel,
        generatedBasedOn: nextQuestion.generatedBasedOn
      });

      await nextQuestionRecord.save();
      interview.questions.push(nextQuestionRecord._id);
      interview.answers.push(answer._id);
      await interview.save();

      res.json(formatResponse('success', 'Answer submitted and analyzed', {
        answer,
        analysis,
        nextQuestion: nextQuestionRecord
      }));
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json(formatResponse('error', 'Failed to submit answer'));
    }
  }

  // Complete interview
  async completeInterview(req, res) {
    try {
      const { interviewId } = req.params;

      const interview = await Interview.findById(interviewId)
        .populate('answers')
        .populate('questions');

      if (!interview) {
        return res.status(404).json(formatResponse('error', 'Interview not found'));
      }

      // Generate comprehensive report
      const report = await AIService.generateInterviewReport(interview);

      interview.status = 'completed';
      interview.completedAt = new Date();
      interview.duration = Math.floor((interview.completedAt - interview.startedAt) / 1000);
      interview.scoring = report.scoring;
      interview.feedback = report.feedback;
      interview.interviewReadiness = report.interviewReadiness;
      interview.speechAnalysis = report.speechAnalysis;

      await interview.save();

      res.json(formatResponse('success', 'Interview completed', {
        interview,
        report
      }));
    } catch (error) {
      console.error('Complete interview error:', error);
      res.status(500).json(formatResponse('error', 'Failed to complete interview'));
    }
  }

  // Get interview report
  async getInterviewReport(req, res) {
    try {
      const { interviewId } = req.params;

      const interview = await Interview.findById(interviewId)
        .populate('questions')
        .populate('answers');

      if (!interview) {
        return res.status(404).json(formatResponse('error', 'Interview not found'));
      }

      if (interview.userId.toString() !== req.userId.toString()) {
        return res.status(403).json(formatResponse('error', 'Unauthorized access'));
      }

      res.json(formatResponse('success', 'Report retrieved', {
        interview,
        scoring: interview.scoring,
        feedback: interview.feedback,
        readiness: interview.interviewReadiness
      }));
    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve report'));
    }
  }

  // Get interview history
  async getInterviewHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;
      const interviews = await Interview.find({ userId: req.userId })
        .populate('courseId')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ startedAt: -1 });

      const total = await Interview.countDocuments({ userId: req.userId });

      res.json(formatResponse('success', 'Interview history retrieved', {
        interviews,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page
        }
      }));
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json(formatResponse('error', 'Failed to retrieve history'));
    }
  }
}

module.exports = new InterviewController();
