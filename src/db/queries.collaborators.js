const Collaborator = require("./models").Collaborator;
const Authorizer =  require("../policies/application");
const Wiki = require("./models").Wiki;
const User = require("./models").User;

module.exports = {
   addCollaborator(req, callback) {
       User.findOne({
           where: {
               email: req.body.collaborator
           }
       })
       .then((user) => {
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
                return callback('User is already collaborator.');
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
            let collabId = req.body.collaborator;
            const authorized = new Authorizer(req.user, wiki, collabId).destroy();
            if(authorized) {
                Collaborator.destroy({
                    where: {
                        userId: collabId,
                        wikiId: req.params.wikiId
                    }
                })
                .then((deletedRecordsCount) => {
                    callback(null, deletedRecordsCount);
                })
                .catch((err) => {
                    callback(err);
                })
            } else {
                req.flash('notice', 'You are not authorized to do that.');
                callback(401);
            }
        }

}
