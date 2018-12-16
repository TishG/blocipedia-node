'use strict';

const faker = require("faker");

 let wikis = [];

 for(let i = 1 ; i <= 6 ; i++){
   wikis.push({
    userId: 5,
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date()
   });
 }

 for(let i = 1 ; i <=5 ; i++){
  wikis.push({
   userId: 6,
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

for(let i = 1 ; i <= 4 ; i++){
  wikis.push({
   userId: 7,
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
