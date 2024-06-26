export function isAdmin(req, res, next) {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
  next();
}

export function isUser(req, res, next) {
  if (req.user.userType !== 'user') {
    return res.status(403).json({ message: 'Access denied. User rights required.' });
  }
  next();
}
