const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WishTemplate = new Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "UserSchema",
      required: [true, "Provide user id for template ownership"],
    },
    title: {
      type: String,
      required: [true, "Please provide wish title"],
      maxLength: 150,
      minLength: 3,
    },
    detail: {
      type: String,
      required: [true, "Please provide wish details"],
      maxLength: 300,
      minLength: 3,
    },
    wishType: {
      type: String,
      required: [true, "Please provide wish type"],
      enum: {
        values: [
          "Birthday",
          "Marriage Anniversary",
          "Death Anniversary",
          "Meeting",
          "Success Greetings",
          "Event",
          "Other",
        ],
        message: `{VALUE} wish type is not supported`,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("WishTemplate", WishTemplate);
