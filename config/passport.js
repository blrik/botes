const passportVkontakte = require('passport-vkontakte').Strategy;
const config = require('./index');


module.exports = function(passport) {

    passport.use(new passportVkontakte({
            clientID: config.auth.app_id,
            clientSecret: config.auth.secret,
            callbackURL: config.auth.callback
        },
        function(accessToken, refreshToken, profile, done) {

            return done(null, {
                user_id: profile.id,
                user_name: profile.displayName,
                profile_url: profile.profileUrl
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });


    passport.deserializeUser(function(data, done) {
        try {
            done(null, JSON.parse(data));
        } catch (e) {
            done(err)
        }
    });
};