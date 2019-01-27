const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator =  require("./models").Collaborator;
const Authorizer = require("../policies/application");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getAllWikis(req, callback){
    // console.log(req);
    // const role = req.user.role;
    //     let options = {};  // no filter / show all by default

    //     if (role == "standard")        // Standard user
    //         options = {private: false};
    //     else if (role == "premium") // Premium user
    //         options = {
    //             [Op.or]: [{private: false}, {userId: req.user.id}, { '$collaborators.userId$': req.user.id }]
    //         };
    //     else (role == "admin")
    //         options = {
    //           [Op.or]: [{private: true}, {private:false}]
    //         }
    const authorized = new Authorizer(req.user, Wiki.findAll());
    if(authorized) {
      return Wiki.findAll({ 
        // where: options,  
        // where: {
        //   [Op.or] : [{userId: req.user.id}, {'$collaborators.userId$': req.user.id}, {private: false}, {private: true}]
        // }, 
        include: [{
          model: Collaborator, 
          as: "collaborators",
          // attributes: ['userId', 'id']
          // attributes: ['userId'],
          }],
          where: {
            // [Op.or] : [{userId: req.user.id}, {'$collaborators.userId$': req.user.id}, {private: false}, {private: true}]
            [Op.or] : [{userId: req.user.id}, {'$collaborators.userId$': req.user.id}, {private: false}]
          }
        })
      .then((wiki) => {
        console.log(wiki);
        callback(null, wiki);   
      })
      .catch((err) => {
        console.log(err);
        callback(err);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.")
      callback(401);
    }
  },
  // getAllCollabWikis(req, callback) {
  //   const authorized = new Authorizer(req.user, Wiki.findAll());
  //   if(authorized) {
  //     return Wiki.findAll({  
  //       include: [{
  //         model: Collaborator,
  //         as: "collaborators",
  //         attributes: ["userId"]
  //       }]
  //     }).then((req, wikis) => {
  //       console.log(wikis);
  //              return wikis.map((wiki) => {
  //                if(wiki.private) {
  //                  for (let i=0;i<wiki.collaborators.length;i++){
  //                    console.log(wiki.collaborators);
  //                      if (wiki.collaborators[i].userId == req.user.userId){
  //                        return wiki;
  //                    }
  //                  }
  //                } else if (wiki.private === false){
  //                     return wiki;
  //                }
  //              })
  //            })
  //     .catch((err) => {
  //       callback(err);
  //     });
  //   } else {
  //     req.flash("notice", "You are not authorized to do that.")
  //     callback(401);
  //   }
  // },
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
                as: "collaborators",
                attributes: ["userId"]
              }]
              // ,
              // include: [{
              //   model: Users, 
              //   as: "users"
              // }]
            })
      .then((wiki) => {
        // console.log(wiki);
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