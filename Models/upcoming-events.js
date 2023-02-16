const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const UpcomingEventsSchema = new Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "UserSchema",
    required: [true, "Provide user id for event ownership"],
  },
  templateId: {
    type: mongoose.Types.ObjectId,
    ref: "WishTemplate",
    required: [true, "Provide template id for this event"],
  },
  eventTime: {
    type: Date,
    require: [true, "Provide time for an event"],
  },
  recipientEmail: {
    type: String,
    required: [true, "Please provide receiver's email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email",
    ],
  },
});

module.exports = model("UpcomingEvents", UpcomingEventsSchema);
