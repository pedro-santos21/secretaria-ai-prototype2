const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const PUB_KEY = fs.readFileSync(path.resolve(__dirname, process.env.RSA_KEY_PUB_PATH), 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport:any) => {
    // The JWT payload is passed into the verify callback

    console.log("! passport is being setup...")

    passport.use(new JwtStrategy(options, async (jwt_payload:any, done:any) => {

        console.log(jwt_payload);
        
        try {
            const user = await User.findOne({_id: jwt_payload.sub});
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
        
    }));
};
