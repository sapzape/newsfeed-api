const chai = require('chai');
const app = require('../../../app')
const expect = chai.expect;

const User = require('../../../models/user');
const factory = require('../../factories/userFactory');

const ENDPOINT = '/users';

describe(`POST ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({});
  });

  describe('when sending the not exists account information', () => {
    describe(`POST ${ENDPOINT}`, () => {
      it('should create new user and return 201 status code', done => {
         chai.request(app).post(ENDPOINT)
          .send(factory.generate())
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
        });
      });
    });
  });

  describe('when sending the exists account information', () => {
    describe(`POST ${ENDPOINT}`, () => {
      it('should get a message that the account already exists and return 404 status code', done => {
        done();
      });

      it('should get a message that the wrong position and return 404 status code', done => {
        done();
      });
    });
  });
});

