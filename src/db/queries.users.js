const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: newUser.email,
        from: 'no-reply@blocipedia.con',
        subject: 'Welcome to Blocipedia',
        text: 'This is an email confirmation that you have signed up for Blocipedia. Log in to start creating content!',
        html: '<strong>This is an email confirmation that you have signed up for Blocipedia. Log in to start creating content!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
      console.log(err);
    })
  }

}