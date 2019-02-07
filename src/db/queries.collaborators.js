const Collaborator = require("./models").Collaborator;
const Authorizer =  require("../policies/application");
const Wiki = require("./models").Wiki;
const User = require("./models").User;

module.exports = {
   addCollaborator(req, callback) {
       User.findOne({
           where: {
               email: req.body.addCollaborator
           }
       })
       .then((user) => {
        //    console.log(user);
        if(!user) {
           return callback('User not found.'); 
        } else if(user.id === req.user.id) {
            return callback('You are not allowed to add yourself as a collaborator.')
        }
        Collaborator.findOne({
                where: {
                    userId: user.id,
                    wikiId: req.params.wikiId
                }
            })
        .then((collaborator) => {
            if(collaborator) {
                return callback('User is already a collaborator.');
            }
            return Collaborator.create({
                wikiId: req.params.wikiId,
                userId: user.id
            })
            .then((collaborator) => {
                callback(null, collaborator);
            })
            .catch((err) => {
                callback(null, err)
            })            
          })
            .catch((err) => {
                callback(null, err)
            })            
          })
            .catch((err) => {
                callback(null, err)
            })                   
        },
        
        removeCollaborator(req, callback) {
            // console.log(req.params);
            // console.log(req.body);
            // let collabId = req.body.collaborator;
            let userId = req.params.userId;
            let wikiId = req.params.wikiId;
            let id = req.params.id;
            // const authorized = new Authorizer(req.user, wikiId, collabId).destroy();
            const authorized = new Authorizer(wikiId, userId, id).destroy();
            if(authorized) {
                Collaborator.destroy({
                    where: {
                        userId: userId,
                        wikiId: wikiId,
                        id: id
                    }
                })
                .then((deletedRecordsCount) => {
                    callback(null, deletedRecordsCount);
                })
                .catch((err) => {
                    console.log(err);
                })
            } else {
                req.flash('notice', 'You are not authorized to do that.');
                callback(401);
            }
        }
        
}
