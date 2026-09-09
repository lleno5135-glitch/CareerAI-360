const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  title: String,
  summary: String,
  personalDetails: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    portfolioUrl: String,
    linkedinUrl: String,
    githubUrl: String
  },
  education: [{
    degree: String,
    field: String,
    institution: String,
    startDate: String,
    endDate: String,
    gpa: Number,
    description: String
  }],
  experience: [{
    jobTitle: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    currentlyWorking: Boolean,
    description: String,
    responsibilities: [String],
    achievements: [String]
  }],
  skills: [{
    category: String,
    items: [{
      name: String,
      level: String,
      yearsOfExperience: Number
    }]
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    date: String,
    keyContributions: [String]
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    link: String
  }],
  languages: [{
    language: String,
    proficiency: String
  }],
  template: {
    type: String,
    enum: ['modern', 'classic', 'minimal', 'creative'],
    default: 'modern'
  },
  atsScore: {
    score: Number,
    analysis: {
      strengths: [String],
      weaknesses: [String],
      missingKeywords: [String],
      recommendations: [String]
    }
  },
  optimization: {
    keywords: [String],
    missingSkills: [String],
    formattingIssues: [String],
    grammarIssues: [String],
    suggestions: [String]
  },
  pdfUrl: String,
  generatedAt: Date,
  lastUpdatedAt: Date,
  isPublic: {
    type: Boolean,
    default: false
  },
  views: {
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

module.exports = mongoose.model('Resume', resumeSchema);
