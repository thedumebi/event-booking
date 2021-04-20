const Event = require("../../models/events");
const User = require("../../models/users");
const { dateToString } = require("../../helpers/date");

const user = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (user) {
    try {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user.createdEvents),
      };
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("User does not exist");
  }
};

const events = async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  if (events) {
    try {
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    user: user.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event),
  };
};

module.exports = {
  transformEvent,
  transformBooking,
};
