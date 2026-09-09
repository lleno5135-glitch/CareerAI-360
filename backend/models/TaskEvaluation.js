const mongoose = require('mongoose');

const taskEvaluationSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskSubmission',
    required: true
  },
  dailyTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyTask'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  feedback: {
    whatWasDoneCorrectly: [String],
    mistakes: [String],
    whyItIsWrong: String,
    correctSolution: String,
    howToImprove: [String],
    personalizedFeedback: String
  },
  codeAnalysis: {
    correctness: {
      score: Number,
      feedback: String
    },
    logic: {
      score: Number,
      feedback: String
    },
    codeQuality: {
      score: Number,
      feedback: String
    },
    efficiency: {
      score: Number,
      feedback: String
    },
    security: {
      score: Number,
      feedback: String
    },
    bestPractices: {
      score: Number,
      feedback: String
    }
  },
  designAnalysis: {
    layout: {
      score: Number,
      feedback: String
    },
    typography: {
      score: Number,
      feedback: String
    },
    ux: {
      score: Number,
      feedback: String
    },
    consistency: {
      score: Number,
      feedback: String
    },
    accessibility: {
      score: Number,
      feedback: String
    }
  },
  theoreticalAnalysis: {
    accuracy: {
      score: Number,
      feedback: String
    },
    completeness: {
      score: Number,
      feedback: String
    },
    understanding: {
      score: Number,
      feedback: String
    },
    explanationQuality: {
      score: Number,
      feedback: String
    }
  },
  evaluatedAt: {
    type: Date,
    default: Date.now
  },
  evaluatedBy: {
    type: String,
    default: 'AI'
  },
  nextSteps: [String],
  skillsToFocus: [String],
  similarTopics: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('TaskEvaluation', taskEvaluationSchema);
