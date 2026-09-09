const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  topic: String,
  learningObjective: String,
  description: String,
  content: {
    explanation: String,
    keyPoints: [String],
    examples: [String]
  },
  resources: [{
    title: String,
    url: String,
    type: String // 'video', 'article', 'documentation'
  }],
  task: {
    title: String,
    description: String,
    instructions: [String],
    acceptanceCriteria: [String]
  },
  submissionType: {
    type: String,
    enum: ['text', 'code', 'file', 'screenshot', 'link', 'multiple'],
    default: 'text'
  },
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: Number, // in minutes
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'evaluated', 'revision_needed'],
    default: 'pending'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskSubmission'
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

module.exports = mongoose.model('DailyTask', dailyTaskSchema);
