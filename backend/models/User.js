const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  phone: String,
  profileImage: String,

  // Education
  education: [{
    degree: String,
    field: String,
    institution: String,
    startDate: Date,
    endDate: Date,
    gpa: Number
  }],

  // Career Information
  currentRole: String,
  careerGoal: String,
  yearsOfExperience: Number,
  industry: String,

  // Skills
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    yearsOfExperience: Number
  }],

  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],

  // Projects
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],

  // Current Course/Challenge
  selectedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  challenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],

  // Resume
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },

  // Interview History
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],

  // Certificates earned
  earnedCertificates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }],

  // User Settings
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
