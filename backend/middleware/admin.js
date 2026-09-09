const admin = (req, res, next) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authorization error'
    });
  }
};

module.exports = admin;
