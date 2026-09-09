const mongoose = require('mongoose');

const interviewAnswerSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQuestion',
    required: true
  },
  questionNumber: Number,
  question: String,
  category: String,
  answerText: String,
  answerAudio: String,
  answerVideo: String,
  transcription: String,
  duration: Number, // in seconds
  score: Number,
  feedback: {
    isRelevant: Boolean,
    relevanceScore: Number,
    clarity: Number,
    completeness: Number,
    accuracy: Number,
    exampleQuality: Number,
    professionalismScore: Number,
    suggestions: [String]
  },
  improvementSuggestions: {
    whatWasGood: [String],
    whatCouldBeImproved: [String],
    betterAnswer: String,
    resources: [{
      title: String,
      url: String
    }]
  },
  aiAnalysis: {
    keyPointsCovered: [String],
    keyPointsMissing: [String],
    technicalAccuracy: Boolean,
    consistencyWithResume: Boolean,
    confidenceLevel: String,
    emotionalTone: String
  },
  comparisonWithPrevious: {
    previousScore: Number,
    improvement: Number,
    trend: String // 'improving', 'stable', 'declining'
  },
  recordedAt: Date,
  analyzedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewAnswer', interviewAnswerSchema);
