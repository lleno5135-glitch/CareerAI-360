const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  certificateNumber: {
    type: String,
    unique: true,
    required: true
  },
  courseName: String,
  studentName: String,
  studentEmail: String,
  completionDate: Date,
  issuanceDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  score: Number,
  averageScore: Number,
  certificateLevel: {
    type: String,
    enum: ['completion', 'excellence', 'distinction'],
    default: 'completion'
  },
  skillsAchieved: [{
    skillName: String,
    proficiencyLevel: String
  }],
  certificateImage: String,
  pdfUrl: String,
  qrCode: String,
  verificationUrl: String,
  status: {
    type: String,
    enum: ['generated', 'issued', 'verified', 'revoked'],
    default: 'generated'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  verifications: {
    type: Number,
    default: 0
  },
  description: String,
  achievements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
