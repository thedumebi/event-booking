const User = require("../../models/users");
const generateToken = require("../../utils/generateToken");

module.exports = {
  users: async () => {
    const users = await User.find()
      .populate("createdEvents")
      .select("-password");
    return users;
  },

  createUser: async (args) => {
    const userExists = await User.findOne({ email: args.userInput.email });
    if (userExists) {
      throw new Error("User already exists");
    } else {
      try {
        const user = await User.create({
          email: args.userInput.email,
          password: args.userInput.password,
        });
        if (user) {
          return user;
        }
      } catch (error) {
        throw error;
      }
    }
  },

  login: async ({ loginInput: { email, password } }) => {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return {
        userId: user.id,
        token: generateToken(user.id, user.email),
        tokenExpiration: 1,
      };
    } else {
      throw new Error("Invalid credentials");
    }
  },
};
