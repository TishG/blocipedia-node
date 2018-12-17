const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback) {

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: user.email,
        from: 'no-reply@blocipedia.con',
        subject: 'Welcome to Blocipedia',
        text: 'This is a confirmation that you have signed up for Blocipedia. Log in to start creating content!',
        html: '<strong>This is a confirmation that you have signed up for Blocipedia. Log in to start creating content!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
      console.log(err);
    })
  },
  upgrade(id, callback) {
    return User.findById(Id).then((user) => {
      if(!user) {
        return callback("User does not exist")
      } else {
        return user.updateAttributes({role: "premium"})
      }
    })
    .catch((err) => {
      callback(err);
    })
  },
  downgrade(id, callback) {
    return User.findById(id).then((user) => {
      if(!user) {
        return callback("User does not exist")
      } else {
        return user.updateAttributes({role: "standard"})
      }
    })
    .catch((err) => {
      callback(err);
    })
  }

}