const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const publishableKey = process.env.PUBLISHABLE_KEY;
const secretKey = process.env.SECRET_KEY;

module.exports = {
    signUp(req, res, next) {
      res.render("users/sign_up");
    },
    create(req, res, next) {
           let newUser = {
             email: req.body.email,
             password: req.body.password,
             passwordConfirmation: req.body.passwordConfirmation
           };
           userQueries.createUser(newUser, (err, user) => {
             if(err) {
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
    signInForm(req, res, next) {
    res.render("users/sign_in");
        },
    signIn(req, res, next) {
      passport.authenticate("local")(req, res, function () {
        if(!req.user) {
          req.flash("notice", "Sign in failed. Please try again.")
          res.redirect("/users/sign_in");
        } else {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
            }
          })
        },
    signOut(req, res, next) {
      req.logout();
      req.flash("notice", "You've successfully signed out!");
      res.redirect("/");
        },
      upgradeDowngradeForm(req, res, next) {
        res.render("users/upgrade_downgrade", {publishableKey});
      },
      upgrade(req, res, next) {
        userQueries.upgrade(req.params.id, (err, user) => {
          if(err) {
            req.flash("error", err);
            res.redirect("/");
          } else {
            res.render("users/payment_response");
            }
          })
        // userQueries.upgrade(req.params.id);
        // res.render("users/payment_response");
      },
      downgrade(req, res, next) {
        userQueries.downgrade(req.params.id, (err, user) => {
          if (err) {
            console.log(err);
            req.flash("error", err); 
            res.redirect("/"); 
          } else {
            req.flash("notice", "We're sorry to see you leave premium, your premium membership has been cancelled.");
            res.redirect("/");
          }
        });
      // userQueries.downgrade(req.params.id);
      // req.flash("notice", "We're sorry to see you leave premium, your premium membership has been cancelled.");
      // res.redirect("/");
    }

}