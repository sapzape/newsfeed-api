const chai = require('chai');
const app = require('../../../app');
const expect = chai.expect;

const Post = require('../../../models/post');
const factory = require('../../factories/userFactory');

const ENDPOINT = '/posts';
let mockPost;

describe(`GET ${ENDPOINT}`, () => {
  before(() => {
    return Post.remove({})
      .then(() => Post.create(factory.generate()))
      .then((post) => mockPost = post);
  });

  describe('when sending the correct data', () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it('should get feeds from subscribe schools and return 201 status code', done => {
        chai.request(app).get(ENDPOINT + '/'+mockPost.userId)
          .end((err, res) => {
            expect(res).to.have.status(200);
            done(); 
        });
      });
    });
  });

  describe('when sending the wrong data', () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it('should get a message that the user not exists and return 404 status code', done => {
        done();
      });
    });
  });
});

