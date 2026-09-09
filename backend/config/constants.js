module.exports = {
  // Challenge
  CHALLENGE_DURATION_DAYS: 30,
  CHALLENGE_STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    PAUSED: 'paused'
  },

  // Task Status
  TASK_STATUS: {
    PENDING: 'pending',
    SUBMITTED: 'submitted',
    EVALUATED: 'evaluated',
    REVISION_NEEDED: 'revision_needed'
  },

  // Submission Types
  SUBMISSION_TYPES: {
    TEXT: 'text',
    CODE: 'code',
    FILE: 'file',
    SCREENSHOT: 'screenshot',
    LINK: 'link'
  },

  // Interview Types
  INTERVIEW_TYPES: {
    PRACTICE: 'practice',
    MOCK: 'mock',
    FINAL: 'final'
  },

  // Interview Rounds
  INTERVIEW_ROUNDS: {
    HR: 'hr',
    TECHNICAL: 'technical',
    PROJECT: 'project',
    BEHAVIORAL: 'behavioral',
    PROBLEM_SOLVING: 'problem_solving'
  },

  // Certificate Status
  CERTIFICATE_STATUS: {
    PENDING: 'pending',
    GENERATED: 'generated',
    VERIFIED: 'verified'
  },

  // File Upload
  MAX_FILE_SIZE: 10485760, // 10 MB
  ALLOWED_FILE_TYPES: ['pdf', 'docx', 'doc', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip'],

  // Scoring
  PASSING_SCORE: 60,
  EXCELLENT_SCORE: 85,
  GOOD_SCORE: 70,

  // Courses
  COURSE_CATEGORIES: [
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
  ],

  DIFFICULTY_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert'],

  // Skill Categories
  SKILL_CATEGORIES: {
    TECHNICAL: 'technical',
    COMMUNICATION: 'communication',
    PROBLEM_SOLVING: 'problem_solving',
    LEADERSHIP: 'leadership',
    CREATIVITY: 'creativity'
  }
};
