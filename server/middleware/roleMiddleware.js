const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

const adminOnly = roleMiddleware(['admin']);
const teacherOnly = roleMiddleware(['teacher']);
const studentOnly = roleMiddleware(['student']);

module.exports = { adminOnly, teacherOnly, studentOnly };
