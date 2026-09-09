const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  dailyTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyTask',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionType: {
    type: String,
    enum: ['text', 'code', 'file', 'screenshot', 'link'],
    required: true
  },
  content: String, // for text/code submissions
  fileUrl: String, // for file uploads
  fileSize: Number,
  fileName: String,
  fileType: String,
  link: String, // for link submissions
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'evaluated', 'revision_needed'],
    default: 'submitted'
  },
  evaluation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskEvaluation'
  },
  quizAnswers: [{
    questionIndex: Number,
    selectedAnswer: String,
    isCorrect: Boolean
  }],
  quizScore: Number,
  notes: String,
  revisionCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema);
