const User = require("../Models/user");
const { BadRequestError, UnauthenticatedError } = require("../Errors/");

async function register(req, res) {
  // passing without validation, mongoose will take care
  const result = await User.create(req.body);
  const token = result.createJWT();
  res.status(200).json({ username: result.name, token: token });
}
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong Password");
  } else {
  }
  res.status(200).json({ username: user.name, token: token });
}

module.exports = { register, login };
