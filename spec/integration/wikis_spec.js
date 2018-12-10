const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

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
              title: "JS Frameworks",
              body: "There is a lot of them",
              private: this.private,
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

      describe("GET /wikis", () => {
        it("should return a status code 200 and all wikis", (done) => {
                 request.get(base, (err, res, body) => {
                   expect(res.statusCode).toBe(200);
                   expect(err).toBeNull();
                   expect(body).toContain("Wikis");
                   expect(body).toContain("JS Frameworks");
                   done();
                 });
               });
        // it("should respond with all wikis", (done) => {
        //   request.get(base, (err, res, body) => {
        //     expect(err).toBeNull();
        //     expect(body).toContain("Wikis");
        //     expect(body).toContain("My first visit to Proxima Centauri b");
        //     done();
        //   });
        // });
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

  describe("POST /wikis/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "blink-182 songs",
        body: "What's your favorite blink-182 song?",
        private: false,
        userId: 1
      }
    };
    it("should create a new wiki and redirect", (done) => {
      request.post(options,
        (err, res, body) => {
          Wiki.findOne({where: {title: "blink-182 songs"}})
          .then((wiki) => {
            console.log(wiki);
            expect(res.statusCode).toBe(303);
            expect(wiki.title).toBe("blink-182 songs");
            expect(wiki.body).toBe("What's your favorite blink-182 song?");
            expect(wiki.private).toBe(false);
            expect(wiki.userId).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });

});