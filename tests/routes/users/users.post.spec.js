const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../../app")
const expect = chai.expect

const User = require("../../../models/user")
const userFactory = require("../../factories/userFactory")

const ENDPOINT = "/users"

let mockUser

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)
    await User.remove({})
    mockUser = userFactory.generate()
    await User.create(mockUser)
  })

  describe("when sending the not exists account information", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should create new user and return 200 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send(userFactory.generate())
          .end((err, res) => {
            expect(res).to.have.status(200)
            done()
          })
      })
    })
  })

  describe("when sending the exists account information", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should get a message that the account already exists and return 404 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send(mockUser)
          .end((err, res) => {
            expect(res).to.have.status(404)
            done()
          })
      })

      it("should get a message that the wrong position and return 404 status code", done => {
        let tempMockUser = userFactory.generate()
        tempMockUser.position = "student1"
        chai
          .request(app)
          .post(ENDPOINT)
          .send(tempMockUser)
          .end((err, res) => {
            expect(res).to.have.status(404)
            done()
          })
      })
    })
  })
})
