const mongoose = require('mongoose');

const proctoringEventSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  events: [{
    timestamp: Date,
    eventType: {
      type: String,
      enum: [
        'looking_away',
        'face_not_visible',
        'multiple_faces',
        'phone_detected',
        'suspicious_movement',
        'noise_detected',
        'window_focus_lost',
        'tab_switch',
        'copy_paste_attempt'
      ]
    },
    severity: {
      type: String,
      enum: ['warning', 'critical'],
      default: 'warning'
    },
    description: String,
    confidence: Number, // 0-100
    action: String, // AI response/warning given
    screenshot: String // optional screenshot
  }],
  eventSummary: {
    lookingAwayCount: Number,
    faceNotVisibleCount: Number,
    multipleFacesCount: Number,
    phoneDetectedCount: Number,
    suspiciousMovementCount: Number,
    noiseDetectedCount: Number,
    windowFocusLostCount: Number,
    tabSwitchCount: Number,
    copyPasteAttemptCount: Number,
    totalWarnings: Number,
    totalCriticalEvents: Number
  },
  attentionScore: {
    type: Number,
    min: 0,
    max: 100
  },
  integrityFlags: [String],
  overallAssessment: {
    type: String,
    enum: ['clean', 'warning', 'critical'],
    default: 'clean'
  },
  observations: String,
  disclaimer: String, // Important legal disclaimer about AI limitations
  reviewRequired: {
    type: Boolean,
    default: false
  },
  reviewedBy: String,
  reviewNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ProctoringEvent', proctoringEventSchema);
