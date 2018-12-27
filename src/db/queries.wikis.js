const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator =  require("./models").Collaborator;
const Authorizer = require("../policies/application");

module.exports = {

  // getAllWikis(callback){
  //   return Wiki.all()

  //   .then((wikis) => {
  //     callback(null, wikis);
  //   })
  //   .catch((err) => {
  //     callback(err);
  //   })
  // },
  // getAllWikis(req, callback){
  //   const authorized = new Authorizer(req.user, wiki.findAll());
  //   if(authorized) {
  //     return Wiki.findAll({   
  //       include: [{
  //         model: Collaborator, as: "collaborators", attributes: ["userId"]
  //       }],
  //       where: {userId: req.user.id}    
  //     })
  //     .then((res) => {
  //       callback(null, wiki);   
  //     })
  //     .catch((err) => {
  //       callback(err);
  //     });
  //   } else {
  //     req.flash("notice", "You are not authorized to do that.")
  //     callback(401);
  //   }
  // },
  getAllWikis(req, user, callback){
    const authorized = new Authorizer(req.user, user, Wiki.findAll());
    if(authorized) {
      return Wiki.findAll({   
        include: [{
          model: Collaborator, as: "collaborators", attributes: ["userId"]
        }]
      })
      .then((wiki) => {
        callback(null, wiki);   
      })
      .catch((err) => {
        callback(err);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.")
      callback(401);
    }
  },
    addWiki(newWiki, callback){
      return Wiki.create({
        title: newWiki.title,
        body: newWiki.body,
        private: newWiki.private,
        userId: newWiki.userId
      })
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
    },
    getWiki(id, callback){
      return Wiki.findById(id, {
              include: [{
                model: Collaborator,
                as: "collaborators"
              }]
            })
      .then((wiki) => {
        console.log(wiki);
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
    },

    // deleteWiki(req, callback){
    //     return Wiki.findById(req.params.id)
    //     .then((wiki) => {
    //       const authorized = new Authorizer(req.user, wiki.destroy());
    //       if(authorized) {
    //         wiki.destroy()
    //         .then((res) => {
    //           callback(null, wiki);
    //         });      
    //       } else {
    //         req.flash("notice", "You are not authorized to do that.")
    //         callback(401);
    //       }
    //     })
    //     .catch((err) => {
    //       callback(err);
    //     });
    //   },
      deleteWiki(id, callback){
      return Wiki.destroy({
          where: {id}
      })
      .then((wiki) => {
          callback(null, wiki);
      })
      .catch((err) => {
          callback(err);
      })
  },

      updateWiki(req, updatedWiki, callback){
             return Wiki.findById(req.params.id)
             .then((wiki) => {
               if(!wiki){
                 return callback("Wiki not found");
               }
                wiki.update(updatedWiki, {
                   fields: Object.keys(updatedWiki)
                 })
                 .then(() => {
                   callback(null, wiki);
                 })
                 .catch((err) => {
                   callback(err);
                 });
             });
           },
           privateToPublic(id) {
             return Wiki.all().then((wikis) => {
               wikis.forEach((wiki) => {
                 if(wiki.userId === id && wiki.private === true) {
                   wiki.update({
                     private: false
                   })
                 }
               })
             })
             .catch((err) => {
               callback(err);
             }) 
           }

  }