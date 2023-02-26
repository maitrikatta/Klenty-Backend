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

  .patch(updateEvent);
router.route("/upcoming/:dateRange").get(eventsOfMonth);
router.route("/upcoming/:eventId").delete(deleteEvent);

router.route("/send").post(sendEvent);
module.exports = router;
