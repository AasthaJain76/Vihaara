import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in the token (usually user id)
 * @param {String} expiresIn - Expiration time (default: 1d)
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = '7d') => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export default generateToken;
