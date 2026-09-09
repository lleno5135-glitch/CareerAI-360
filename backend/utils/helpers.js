const generateToken = (userId, secret = process.env.JWT_SECRET) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId },
    secret || 'your_jwt_secret_key_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const formatResponse = (status, message, data = null) => {
  const response = {
    status,
    message,
    ...(data && { data })
  };
  return response;
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const calculateStreak = (completedDays) => {
  let streak = 0;
  if (!completedDays || completedDays.length === 0) return streak;
  
  const sortedDays = completedDays.sort((a, b) => a.day - b.day);
  streak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i].day === sortedDays[i - 1].day + 1) {
      streak++;
    } else {
      streak = 1;
    }
  }
  
  return streak;
};

const calculateProgress = (currentDay, totalDays) => {
  return Math.round((currentDay / totalDays) * 100);
};

const calculateAverageScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
};

module.exports = {
  generateToken,
  validateEmail,
  formatResponse,
  getRandomColor,
  calculateStreak,
  calculateProgress,
  calculateAverageScore
};
