const Booking = require("../../models/bookings");
const Event = require("../../models/events");
const { transformBooking } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.user) {
      throw new Error("Not authorized");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.user) {
      throw new Error("Not authorized");
    }
    const event = await Event.findById(args.eventId);
    const booking = await Booking.create({
      user: req.user,
      event,
    });
    return transformBooking(booking);
  },
  cancelBooking: async (args, req) => {
    if (!req.user) {
      throw new Error("Not authorized");
    }

    const booking = await Booking.findById(args.bookingId).populate(
      "event",
      "user"
    );
    if (booking.user !== req.user.id) {
      throw new Error("Not authorized!!!");
    }
    try {
      const event = transformEvent(booking.event);
      console.log({ event });
      await booking.delete();
      return event;
    } catch (err) {
      throw err;
    }
  },
};
