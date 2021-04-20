const eventResolver = require("./events");
const bookingResolver = require("./bookings");
const userResolver = require("./users");

const rootResolver = {
  ...eventResolver,
  ...bookingResolver,
  ...userResolver,
};

module.exports = rootResolver;
