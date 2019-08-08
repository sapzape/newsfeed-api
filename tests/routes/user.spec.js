const expect = require('chai').expect();
const server = require('../utils/mockServer');
const User = require('../../models/user');
const factory = require('../factories/userFactory');

const ENDPOINT = '/users';
let mockUser;

describe(`GET ${ENDPOINT}`, () => {
  before(() => {
    return User.remove({})
      .then(() => mockUser = User.create(factory.generate()));
  });

  describe('#201', () => {
    it('return user list', done => {
      server.get(ENDPOINT)
        .send(mockUser)
        .end((err, res) => {
          expect((res).to.have.status(200));
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});

