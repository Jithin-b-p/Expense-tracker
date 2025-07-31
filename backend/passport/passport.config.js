import passport from "passport";
import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";

import User from "../models/user.model.js";

export const configPassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user");

    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error("Invalid username or password");
        }

        return done(null, user);
      } catch (err) {}
    })
  );
};
