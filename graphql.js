const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function getUserId(auth, secret) {
  if (!auth) return null;

  const token = auth.replace("Bearer ", "");
  try {
    const { userId } = jwt.verify(token, secret);
    return userId;
  } catch (e) {
    return null;
  }
}

const createToken = (userId, secret) => jwt.sign({ userId }, secret);

const comparePasswords = (a, b) => bcrypt.compare(a, b);
const hashPassword = password => bcrypt.hash(password, 10);

module.exports = {
  getUserId,
  createToken,
  comparePasswords,
  hashPassword
};
