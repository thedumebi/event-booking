const Event = require("../../models/events");
const User = require("../../models/users");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    const events = await Event.find();
    try {
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      console.log({ error });
      throw error;
    }
  },
  createEvent: async (args, req) => {
    if (!req.user) {
      throw new Error("Not authorized");
    }
    const event = await Event.create({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      creator: req.user,
    });

    if (event) {
      try {
        const owner = await User.findByIdAndUpdate(
          req.user.id,
          { $push: { createdEvents: event } },
          { new: true }
        );
        if (owner) return transformEvent(event);
      } catch (error) {
        throw error;
      }
    }
  },
};
