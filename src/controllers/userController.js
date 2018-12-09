const userQueries = require("../db/queries.users.js");
const passport = require("passport");
// const sgMail = require('@sendgrid/mail');

module.exports = {
    signUp(req, res, next) {
      res.render("users/sign_up");
    },
    create(req, res, next){
           let newUser = {
             email: req.body.email,
             password: req.body.password,
             passwordConfirmation: req.body.passwordConfirmation
           };
           userQueries.createUser(newUser, (err, user) => {
             if(err){
               req.flash("error", err);
               res.redirect("/users/sign_up");
             } else {
               passport.authenticate("local")(req, res, () => {
                 req.flash("notice", "You've successfully signed in!");
                 res.redirect("/");
               })
             }
           });
         },
         signInForm(req, res, next){
          res.render("users/sign_in");
        },
        signIn(req, res, next){
          passport.authenticate("local")(req, res, function () {
            if(!req.user){
              req.flash("notice", "Sign in failed. Please try again.")
              res.redirect("/users/sign_in");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
          })
        },
        signOut(req, res, next){
          req.logout();
          req.flash("notice", "You've successfully signed out!");
          res.redirect("/");
        }
    //     sendEmail(req, res, next) {
    //       let newUser = {
    //         email: req.body.email,
    //         password: req.body.password,
    //         passwordConfirmation: req.body.passwordConfirmation
    //       };
    //       const msg = {
    //           // to: req.body.email,
    //           to: newUser.email,
    //           from: 'noreply@blocipedia.com',
    //           subject: 'Welcome to Blocipedia!',
    //           text: 'Thank you joining blocipedia!, sign up to view your profile.',
    //           html: '<strong>Thank you joining blocipedia!, sign up to view your profile.</strong>',
    //       };
    //       userQueries.createUser(newUser, (err, user) => {
    //       if(err){
    //           req.flash("error", err);
    //           res.redirect("/users/sign_up");
    //       } else {
    //           passport.authenticate("local")(req, res, () => {
    //               req.flash("notice", "You've successfully signed in!");
    //               sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //               sgMail.send(msg);
    //               res.redirect("/");
    //           })
    //       }
    //   })
    // }

}