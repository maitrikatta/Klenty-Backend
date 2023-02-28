const { BadRequestError } = require("../Errors");
const moment = require("moment");
const UpcomingEvents = require("../Models/upcoming-events");
const WishTemplate = require("../Models/wish-template");
const sendMail = require("../Libs/send-mail");
const joinEventsTemlate = require("../Models/Pipelines/join-events-temlate");
const createEvent = async (req, res) => {
  const {
    user: { userId },
  } = req.body;
  const { eventTime, email, templateId } = req.body;

  if (!moment(eventTime).isValid())
    throw new BadRequestError("invalid event time");

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
  const { eventId } = req.params;
  const result = await UpcomingEvents.deleteOne({
    _id: eventId,
    createdBy: userId,
  });
  res.status(201).json(result);
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
  // dateRange is just toISOString

  let { dateRange: currMonth } = req.params;
  if (currMonth === undefined || currMonth === null)
    throw new BadRequestError("No Date Range Provided");

  // parse the date to local
  // may be in invalid format
  try {
    currMonth = moment(currMonth);
    currMonth.date(1);
    currMonth.hour(0);
    currMonth.minute(0);
  } catch (err) {
    throw new BadRequestError("Invalid date format, needs ISO 8601");
  }

  // make new date for limit

  const nextMonth = moment(currMonth);
  // increment month
  nextMonth.month(currMonth.month() + 1);
  // set day to first for $lt comparison
  nextMonth.date(1);
  const result = await UpcomingEvents.aggregate(
    joinEventsTemlate(currMonth, nextMonth, userId)
  );
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
  res.send(mailResult);
};
module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  eventsOfMonth,
  sendEvent,
};
