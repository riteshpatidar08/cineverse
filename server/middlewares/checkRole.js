/**
 * Middleware to restrict access based on user roles.
 * Must be preceded by verifyToken middleware which populates req.user.
 * 
 * @param  {...string|string[]} roles - Allowed roles e.g. 'admin' or ['theatreAdmin', 'admin']
 * @returns {Function} Express middleware function
 */
const checkRole = (...roles) => {
  // Support both checkRole('admin') and checkRole(['admin', 'theatreAdmin'])
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required: User session not found',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = checkRole;
