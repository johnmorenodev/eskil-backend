const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No Authorization' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'No Authorization' });
  }
};
