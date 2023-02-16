const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEvent,
  updateEvent,
} = require("../Controllers/upcoming-events");
router.route("/upcoming").post(createEvent);
module.exports = router;
