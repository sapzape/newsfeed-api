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

describe(`PUT ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)
    await User.remove({})
    await School.remove({})
    await Follow.remove({})

    mockUser = await User.create(userFactory.generate())
    mockSchool = await School.create(schoolFactory.generate())
  })

  describe("when sending the correct data", () => {
    describe(`PUT ${ENDPOINT}/likes`, () => {
      it("should be subscribed and return 200 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}/likes`)
          .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            done()
          })
      })

      it("shold be resubscribed and return 200 status code", done => {
        Follow.updateFollow(
          { userId: mockUser._id, subscribeTo: mockSchool._id },
          { endFollow: Date.now() }
        ).then(() => {
          chai
            .request(app)
            .put(`${ENDPOINT}/${mockUser.userId}/likes`)
            .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
            .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body.success).to.be.true
              expect(res.body.message).to.be.equal("Start subscription again.")
              expect(res.body.data.endFollow).to.be.null
              done()
            })
        })
      })
    })

    describe(`PUT ${ENDPOINT}/unlikes`, () => {
      it("should be unsubscribed and return 200 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}/unlikes`)
          .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            expect(res.body.message).to.be.equal("Unsubscribe successful.")
            done()
          })
      })
    })
  })

  describe("when sending the wrong data", () => {
    describe(`PUT ${ENDPOINT}/likes`, () => {
      it("should get a message that the user not exists and return 404 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}test/likes`)
          .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            expect(res.body.message).to.be.contain("user is not registered.")
            done()
          })
      })

      it(">>> should get a message that the school not exists and return 404 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}/likes`)
          .send({ region: `${mockSchool.region}test`, schoolName: `${mockSchool.schoolName}test` })
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            done()
          })
      })

      it("should get a message that already subscribed to school and return 404 status code", done => {
        Follow.updateFollow(
          { userId: mockUser._id, subscribeTo: mockSchool._id },
          { startFollow: Date.now(), endFollow: null }
        ).then(() => {
          chai
            .request(app)
            .put(`${ENDPOINT}/${mockUser.userId}/likes`)
            .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
            .end((err, res) => {
              expect(res).to.have.status(404)
              expect(res.body.success).to.be.false
              expect(res.body.message).to.be.contain("Already subscribed to this school.")
              done()
            })
        })
      })
    })

    describe(`PUT ${ENDPOINT}/unlikes`, () => {
      it("should get a message that the user not exists and return 404 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}test/unlikes`)
          .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            expect(res.body.message).to.be.contain("user is not registered.")
            done()
          })
      })

      it("should get a message that the school not exists and return 404 status code", done => {
        chai
          .request(app)
          .put(`${ENDPOINT}/${mockUser.userId}/unlikes`)
          .send({ region: `${mockSchool.region}test`, schoolName: `${mockSchool.schoolName}test` })
          .end((err, res) => {
            expect(res).to.have.status(401)
            expect(res.body.success).to.be.false
            expect(res.body.message).to.be.contain("not a registered school")
            done()
          })
      })

      it("should get a message that never subscribed to school and return 404 status code", done => {
        School.create(schoolFactory.generate()).then(school => {
          chai
            .request(app)
            .put(`${ENDPOINT}/${mockUser.userId}/unlikes`)
            .send({ region: school.region, schoolName: school.schoolName })
            .end((err, res) => {
              expect(res).to.have.status(404)
              expect(res.body.success).to.be.false
              expect(res.body.message).to.be.equal("Not subscribed to this school.")
              done()
            })
        })
      })

      it("should get a message that already unsubscribed to school and return 404 status code", done => {
        Follow.updateFollow(
          { userId: mockUser._id, subscribeTo: mockSchool._id },
          { endFollow: Date.now() }
        ).then(() => {
          chai
            .request(app)
            .put(`${ENDPOINT}/${mockUser.userId}/unlikes`)
            .send({ region: mockSchool.region, schoolName: mockSchool.schoolName })
            .end((err, res) => {
              expect(res).to.have.status(404)
              expect(res.body.success).to.be.false
              expect(res.body.message).to.be.equal("This school has already been unsubscribed.")
              done()
            })
        })
      })
    })
  })
})
