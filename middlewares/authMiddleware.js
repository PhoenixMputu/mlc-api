const passportJWT = require("passport-jwt");
const secret = process.env.JWT_SECRET;
const passport = require("passport");
const {User} = require("../models/user");

const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const opts = {};
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

module.exports = authMiddleware = passport.use(
  new jwtStrategy(opts, async function (jwt_payload, done) {
    const result = await User.findOne({ id: jwt_payload.sub });
    if (result) {
      return done(null, result);
    }
    else {
      return done(null, false);
  }
  })
);