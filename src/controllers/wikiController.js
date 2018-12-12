const Wiki = require('../db/models').Wiki;
const User = require('../db/models').User;

module.exports = {
    index(req, res, next){
      Wiki.findAll({
        })
        .then(wikis => {
        res.render('wikis/index.ejs', {wikis});
      })
        .catch(err => {
          res.render('wikis/index.ejs', { title: 'Wikis'});
        });
       },
    new(req, res, next){
        res.render("wikis/new");
      },
    create(req, res, next){
      console.log(req)
       if (!req.body.private)
         req.body.private = false;

       Wiki.create({
         title: req.body.title,
         body: req.body.body,
         private: req.body.private,
         userId: req.user.id
      })
      .then(wiki => {
        req.flash("notice", "Wiki was created successfully.")
        res.redirect(`/wikis/${wiki.id}`);
      })
        .catch(err => {
          req.flash("error", "Error saving wiki.  Please try again.")
          res.redirect('/wikis/create');
        });
       },
     show(req, res, next){
         Wiki.findById(req.params.id)
           .then(wiki => {
           res.render('wikis/show.ejs', {wiki});
         })
           .catch(err => {
             res.render('wikis/show.ejs', {error: err});
           });
      },
      destroy(req, res, next){
        Wiki.deleteWiki(req.params.id, (err, wiki) => {
          if(err){
            res.redirect(500, `/wikis/${wiki.id}`)
          } else {
            res.redirect(303, "/wikis")
          }
        });
      },
      edit(req, res, next){
        Wiki.getWiki(req.params.id, (err, wiki) => {
          if(err || wiki == null){
            res.redirect(404, "/");
          } else {
            res.render("wikis/edit", {wiki});
          }
        });
      },
      update(req, res, next){
             Wiki.updateWiki(req.params.id, req.body, (err, wiki) => {
               if(err || wiki == null){
                 res.redirect(404, `/wikis/${req.params.id}/edit`);
               } else {
                 res.redirect(`/wikis/${wiki.id}`);
               }
             });
           }

  }
