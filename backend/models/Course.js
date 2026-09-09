const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    unique: true
  },
  description: String,
  fullDescription: String,
  category: {
    type: String,
    required: true,
    enum: [
      'Programming',
      'Web Development',
      'Data',
      'AI/ML',
      'Design',
      'Cyber Security',
      'Cloud',
      'Networking',
      'Testing',
      'Business',
      'Digital Marketing'
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  icon: String,
  banner: String,
  duration: Number, // in days
  estimatedHours: Number,
  learningOutcomes: [String],
  prerequisites: [String],
  requiredSkills: [String],
  courseStructure: {
    modules: Number,
    days: Number,
    projects: Number,
    interviews: Number
  },
  tags: [String],
  popularity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  enrolledCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Course', courseSchema);
