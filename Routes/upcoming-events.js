const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEvent,
  updateEvent,
  eventsOfMonth,
  sendEvent,
} = require("../Controllers/upcoming-events");
router
  .route("/upcoming")
  .post(createEvent)
  .delete(deleteEvent)
  .patch(updateEvent)
  .get(eventsOfMonth);

router.route("/send").post(sendEvent);
module.exports = router;
