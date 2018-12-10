const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

        beforeEach((done) => {
          this.user;
          this.wiki;
        sequelize.sync({force: true}).then((res) => {
          User.create({
            email: "starman@tesla.com",
            password: "Trekkie4lyfe"
          })
          .then((user) => {
            this.user = user;
            Wiki.create({
              title: "My first visit to Proxima Centauri b",
              body: "I saw some rocks.",
              userId: this.user.id
            })
            .then((wiki) => {
              this.wiki = wiki;
              done();
            });
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      }); 

  describe("GET /wikis/new", () => {

    it("should render a new wiki form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

});