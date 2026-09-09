const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  questionNumber: Number,
  category: {
    type: String,
    enum: ['hr', 'technical', 'project', 'behavioral', 'problem_solving'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  context: String, // Context from resume or course
  expectedAnswerKeyPoints: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: Number, // in seconds
  questionType: {
    type: String,
    enum: ['open_ended', 'scenario', 'coding', 'multiple_choice', 'technical'],
    default: 'open_ended'
  },
  generatedBasedOn: String, // 'resume', 'course', 'previous_answer', 'skill_gap'
  adaptivityLevel: {
    type: Number,
    default: 0 // 0 = initial, 1+ = follow-up
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
