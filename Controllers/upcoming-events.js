const { BadRequestError } = require("../Errors");
const moment = require("moment");
const UpcomingEvents = require("../Models/upcoming-events");
const createEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventTime, email, templateId } = req.body;

  // check if the event time not past

  const isFuture = moment().isBefore(eventTime);
  if (!isFuture)
    throw new BadRequestError("Got past time instead of future time");

  const m = moment(new Date(eventTime));

  // make sure date will be stored in UTC ISO 8601
  const result = await UpcomingEvents.create({
    createdBy: userId,
    eventTime: m,
    recipientEmail: email,
    templateId,
  });

  res.status(201).json({ data: "result" });
};
const deleteEvent = (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventDate } = req.body;
  console.log(eventDate);
  res.status(201).json({ msg: "ok" });
};
const updateEvent = (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventDate } = req.body;
  console.log(eventDate);
  res.status(201).json({ msg: "ok" });
};

module.exports = { createEvent, deleteEvent, updateEvent };
