const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  interviewType: {
    type: String,
    enum: ['practice', 'mock', 'final'],
    default: 'practice'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'paused'],
    default: 'scheduled'
  },
  rounds: {
    type: String,
    enum: ['hr', 'technical', 'project', 'behavioral', 'problem_solving', 'full'],
    default: 'full'
  },
  startedAt: Date,
  completedAt: Date,
  duration: Number, // in seconds
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQuestion'
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewAnswer'
  }],
  videoUrl: String,
  audioUrl: String,
  transcription: String,
  scoring: {
    overallScore: Number,
    technicalKnowledge: Number,
    communication: Number,
    problemSolving: Number,
    resumeKnowledge: Number,
    projectKnowledge: Number,
    hrPerformance: Number,
    answerRelevance: Number,
    confidenceDelivery: Number,
    timeManagement: Number
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    areasToImprove: [String],
    betterAnswers: [{
      questionIndex: Number,
      improvedAnswer: String,
      explanation: String
    }],
    improvementPlan: [{
      topic: String,
      practices: [String],
      duration: String
    }]
  },
  interviewReadiness: {
    score: Number,
    status: {
      type: String,
      enum: ['ready', 'needs_practice', 'not_ready'],
      default: 'needs_practice'
    },
    explanation: String,
    disclaimer: String
  },
  proctoring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProctoringEvent'
  },
  speechAnalysis: {
    relevance: Number,
    clarity: Number,
    grammar: Number,
    fillerWords: Number,
    speakingSpeed: Number,
    pauses: Number,
    confidence: Number,
    technicalAccuracy: Number
  },
  attention: {
    lookingAway: Number,
    faceNotVisible: Number,
    multipleFaces: Number,
    phoneDetected: Number,
    warnings: [{
      type: String,
      timestamp: Date,
      description: String
    }]
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
