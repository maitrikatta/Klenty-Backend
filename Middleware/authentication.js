const { UnauthenticatedError } = require("../Errors");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication failed!");
  }
  const token = authHeader.split(" ")[1];
  if (!token) throw new UnauthenticatedError("No token found !");
  else {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.body.user = { userId: payload.userId, username: payload.username };
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError)
        throw new UnauthenticatedError("Invalid token");
    }
  }
  next();
};

module.exports = auth;
