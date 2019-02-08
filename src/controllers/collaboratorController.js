const collaboratorQueries = require("../db/queries.collaborators.js");
// const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");

module.exports = {
    add(req, res, next) {
        if(req.user) {
            collaboratorQueries.addCollaborator(req, (err, collaborator) => {
                if(err) {
                    req.flash('error', err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash('notice', 'You must be signed in to do that.');
            res.redirect(req.headers.referer);
        }
    },
    remove(req, res, next) {
        if(req.user) {
            // const authorized = new Authorizer(req.user, wikiId, collabId).destroy();
            const authorized = new Authorizer( req.params.userId ).destroy();
            if(authorized) {
                console.log("autohized? " + authoried);
                console.log("userId: " + req.params.userId);
            collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
                if(err) {
                    req.flash('error', err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash('notice', 'You must be signed in to do that.');
            res.redirect(req.headers.referer);
            }
        }
    }
}