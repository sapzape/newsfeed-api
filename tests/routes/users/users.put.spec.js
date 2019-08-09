const chai = require('chai');
const app = require('../../../app');
const expect = chai.expect;

const User = require('../../../models/user');
const factory = require('../../factories/userFactory');

const ENDPOINT = '/users';
let mockUser;

describe(`PUT ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({})
      .then(() => User.create(factory.generate()))
      .then((user) => mockUser = user);
  });

  describe('when sending the correct data', () => {
    describe(`PUT ${ENDPOINT}/likes`, () => {
      it('should be subscribed and return 201 status code', done => {
         chai.request(app).post(ENDPOINT)
          .send(factory.generate())
          .end((err, res) => {
            expect(res).to.have.status(201);
            done();
          });
        });

      it('shold be resubscribed and return 201 status code', done => {
        done();
      });
    });

    describe(`PUT ${ENDPOINT}/unlikes`, () => {
      it('should be unsubscribed and return 201 status code', done => {
        done();
      });
    });
  });

  describe('when sending the wrong data', () => {
    describe(`PUT ${ENDPOINT}/likes`, () => {
      it('should get a message that the user not exists and return 404 status code', done => {
        done();
      });

      it('should get a message that the school not exists and return 404 status code', done => {
        done();
      });

      it('should get a message that already subscribed to school and return 404 status code', done => {
        done();
      });
    });

    describe(`PUT ${ENDPOINT}/unlikes`, () => {
      it('should get a message that the user not exists and return 404 status code', done => {
        done();
      });

      it('should get a message that the school not exists and return 404 status code', done => {
        done();
      });

      it('should get a message that never subscribed to school and return 404 status code', done => {
        done();
      });

      it('should get a message that already unsubscribed to school and return 404 status code', done => {
        done();
      });
    });
  });
});

