const bcrypt = require("bcryptjs");
const User = require("../models/User");

const resolvers = {
    Query: {
        getUsers: async () => await User.find(),
    },

    Mutation: {
        createUser: async (_, { username, email, password, name }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, name });
        return await user.save();
        },

        loginUser: async (_, { username, password }) => {
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        return { message: "Login successful" };
        },
    },
};

module.exports = resolvers;
