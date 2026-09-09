const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: String,
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'paused'],
    default: 'not_started'
  },
  currentDay: {
    type: Number,
    default: 0
  },
  totalDays: {
    type: Number,
    default: 30
  },
  dailyTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyTask'
  }],
  completedDays: [{
    day: Number,
    completedAt: Date,
    score: Number
  }],
  streakDays: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  startDate: Date,
  completedDate: Date,
  estimatedCompletionDate: Date,
  lastAccessedDate: Date,
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  skillsGained: [{
    skillName: String,
    proficiencyLevel: String
  }],
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

module.exports = mongoose.model('Challenge', challengeSchema);
