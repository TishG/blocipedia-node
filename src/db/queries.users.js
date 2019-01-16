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
  // upgrade(id, callback) {
  //   return User.findById(id).then((user) => {
  //     if(!user) {
  //       return callback("User does not exist")
  //     } else {
  //       return user.updateAttributes({role: "premium"})
  //     }
  //   })
  //   .catch((err) => {
  //     callback(err);
  //   })
  // },
  upgrade(id, callback) { 
    return User.findById(id).then((user) => { 
      if(!user) { 
        return callback("User does not exist") 
      } else { 
        user.updateAttributes({role: "premium"})
        .then((err, user) => { 
          if (err) { 
            return callback(err)
          } else {
            return callback(null, user)
          }
        })
      }
    }) 
    .catch((err) => { 
      callback(err); 
    });
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
  },

  getUser(id, callback) {
    let result = {};
    User.findById(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;
        Collaborator.scope({
          method: ["collaborationsFor", id]
        })
        .all()
        .then((collaborations) => {
          result["collaborations"] = collaborations;
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }
    })
  }

}