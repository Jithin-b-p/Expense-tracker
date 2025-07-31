import { users } from "../dummyData/data.js";

const userResolver = {
  Query: {
    users: (_, _, { req, res }) => users,
    user: (_, { userId }, { req, res }) => {
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {},
};

export default userResolver;
