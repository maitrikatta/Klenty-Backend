const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 4,
    maxLength: 15,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 8,
  },
});
// pre and post are hooks are like plugins
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFE,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePass) {
  const isMatch = await bcrypt.compare(candidatePass, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
