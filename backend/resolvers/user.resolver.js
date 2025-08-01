import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";

const userResolver = {
  Query: {
    authuser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authuser: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        {
          const { username, name, password, gender } = input;

          if (!username || !name || !password || !gender) {
            throw new Error("All fields must be present");
          }

          const user = await User.findOne(username);
          if (user) {
            throw new Error("User already present");
          }

          const salt = await bcrypt.genSalt(10);

          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = new User({
            username,
            name,
            password: hashedPassword,
            gender,
            profilePicture: `https://avatar.iran.liara.run/public/${
              gender === male ? boy : girl
            }?username=${username}`,
          });

          await newUser.save();
          await context.login(newUser);
          return newUser;
        }
      } catch (err) {
        console.error("Error in signup: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (err) {
        console.error("Error in login: ", err);
        throw new Error(err.message || "Internal Server error");
      }
    },

    logout: async (_, __, context) => {
      try {
        const { req, res } = context;
        await context.logout();

        req.session.destroy((err) => {
          if (err) {
            throw err;
          }
        });

        req.clearCookie("connect.sid");

        return { message: "Logout successfully" };
      } catch (err) {
        console.error("Error in logout: ", err);
        throw new Error(err.message || "Internal Server error");
      }
    },
  },
};

export default userResolver;
