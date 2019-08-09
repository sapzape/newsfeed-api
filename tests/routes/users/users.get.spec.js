const chai = require('chai');
const app = require('../../app');
const expect = chai.expect;

const server = require('../utils/mockServer');
const User = require('../../models/user');
const factory = require('../factories/userFactory');

const ENDPOINT = '/users';
let mockUser;

describe(`GET ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({})
      .then(() => User.create(factory.generate()))
      .then((user) => mockUser = user);
  });

  describe('when sending the correct user id', () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it('should get user information corressponding to id and return 201 status code', done => {
        chai.request(app).get(ENDPOINT + '/'+mockUser.userId)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done(); 
        });
      });
    });

    describe(`GET ${ENDPOINT}/:userId/likes`, () => {
      it('should get school list the user subscibed and return 201 status code', done => {
         chai.request(app).get(ENDPOINT + '/' + mockUser.userId + '/likes')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
      });
    });
  });

  describe('when sending the wrong user id', () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it('should get a message that it does not exist and return 404 status code', done => {

      });
    });
    
    describe(`GET ${ENDPOINT}/:userId/likes`, () => {
      it('should get a message that it does not exist and return 404 status code - /likes', done => {

      });
    });
  });
});

