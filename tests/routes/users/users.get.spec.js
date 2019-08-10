const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../../app")
const expect = chai.expect

const User = require("../../../models/user")
const School = require("../../../models/school")
const Follow = require("../../../models/follow")
const userFactory = require("../../factories/userFactory")
const schoolFactory = require("../../factories/schoolFactory")

const ENDPOINT = "/users"

let mockUser
let mockSchool

describe(`GET ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)
    await User.remove({})
    await School.remove({})
    await Follow.remove({})

    mockUser = await User.create(userFactory.generate())
    mockSchool = await School.create(schoolFactory.generate())
    await Follow.create({
      userId: mockUser._id,
      subscribeTo: mockSchool._id,
      startFollow: Date.now(),
      endFollow: null
    })
  })

  describe("when sending the correct user id", () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it("should get user information corressponding to id and return 200 status code", done => {
        chai
          .request(app)
          .get(`${ENDPOINT}/${mockUser.userId}`)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            expect(res.body.data.position).to.equal("student")
            expect(res.body.data.userId).to.equal(mockUser.userId)
            done()
          })
      })
    })

    describe(`GET ${ENDPOINT}/:userId/likes`, () => {
      it("should get school list the user subscibed and return 200 status code", done => {
        chai
          .request(app)
          .get(`${ENDPOINT}/${mockUser.userId}/likes`)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            expect(res.body.data[0].userId.position).to.equal("student")
            expect(res.body.data[0].userId.userId).to.equal(mockUser.userId)
            expect(res.body.data[0].subscribeTo.region).to.equal(mockSchool.region)
            expect(res.body.data[0].subscribeTo.schoolName).to.equal(mockSchool.schoolName)
            done()
          })
      })
    })
  })

  describe("when sending the wrong user id", () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it("should get a message that it does not exist and return 401 status code", done => {
        chai
          .request(app)
          .get(`${ENDPOINT}/${mockUser.userId}test`)
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            done()
          })
      })
    })

    describe(`GET ${ENDPOINT}/:userId/likes`, () => {
      it("should get a message that it does not exist and return 401 status code", done => {
        chai
          .request(app)
          .get(`${ENDPOINT}/${mockUser.userId}test/likes`)
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            done()
          })
      })
    })
  })
})
