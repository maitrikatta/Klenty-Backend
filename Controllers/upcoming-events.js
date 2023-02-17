const { BadRequestError } = require("../Errors");
const moment = require("moment");
const UpcomingEvents = require("../Models/upcoming-events");
const WishTemplate = require("../Models/wish-template");
const sendMail = require("../Libs/send-mail");
const createEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventTime, email, templateId } = req.body;

  // check if the event time is not past
  // works fine without worrying utc/gmt
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

  res.status(201).json({ data: result });
};
const deleteEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventId } = req.body;
  const result = await UpcomingEvents.deleteOne({
    _id: eventId,
    createdBy: userId,
  });
  res.status(201).json({ data: result });
};
const updateEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventTime, email, templateId, eventId } = req.body;
  const isFuture = moment().isBefore(eventTime);
  if (!isFuture)
    throw new BadRequestError("Got past time instead of future time");

  const m = moment(new Date(eventTime));

  const result = await UpcomingEvents.updateOne(
    { _id: eventId, createdBy: userId },
    {
      eventTime: m,
      recipientEmail: email,
      templateId,
    }
  );
  res.status(201).json({ data: result });
};
const eventsOfMonth = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  let { dateRange } = req.body;

  // parse the date
  dateRange = moment(dateRange);
  //make new object for limit
  const nextMonth = moment(dateRange);
  // increment month
  nextMonth.month(dateRange.month() + 1);
  // set day to first
  nextMonth.date(1);

  const result = await UpcomingEvents.find({
    eventTime: { $gte: dateRange, $lt: nextMonth },
  });
  res.send({ data: result });
};

const sendEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventId } = req.body;
  if (!eventId) throw new BadRequestError("Need event id, found none");
  const eventResult = await UpcomingEvents.findOne(
    {
      createdBy: userId,
      _id: eventId,
    },
    { eventTime: 1, recipientEmail: 1, templateId: 1, _id: 0 }
  );
  if (!eventResult) throw new BadRequestError("No such event found");
  const templateResult = await WishTemplate.findOne(
    {
      _id: eventResult.templateId,
      createdBy: userId,
    },
    { title: 1, detail: 1, wishType: 1, _id: 0 }
  );
  const mailResult = await sendMail(eventResult, templateResult);
  res.send({ data: mailResult });
};
module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  eventsOfMonth,
  sendEvent,
};
