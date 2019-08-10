const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../../app")
const expect = chai.expect

const User = require("../../../models/user")
const School = require("../../../models/school")
const userFactory = require("../../factories/userFactory")
const schoolFactory = require("../../factories/schoolFactory")

const ENDPOINT = "/posts"

let mockUser
let mockSchool

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)
    await User.remove({})
    await School.remove({})

    mockUser = await User.create(userFactory.generate())
    mockSchool = await School.create(schoolFactory.generate())
  })

  describe("when posting to school page with correct data", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should create new post and return 200 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send({
            userId: mockUser.userId,
            schoolName: mockSchool.schoolName,
            region: mockSchool.region,
            contents: "test post!",
            type: "general"
          })
          .end((err, res) => {
            expect(res).to.have.status(200)
            done()
          })
      })
    })
  })

  describe("when posting to school page with incorrect data", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should get a message that the user not exists and return 401 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send({
            userId: `${mockUser.userId}test`,
            schoolName: mockSchool.schoolName,
            region: mockSchool.region,
            contents: "test post!",
            type: "general"
          })
          .end((err, res) => {
            expect(res).to.have.status(401)
            done()
          })
      })

      it("should get a message that the school not exists and return 401 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send({
            userId: mockUser.userId,
            schoolName: `${mockSchool.schoolName}test`,
            region: mockSchool.region,
            contents: "test post!",
            type: "general"
          })
          .end((err, res) => {
            expect(res).to.have.status(401)
            done()
          })
      })

      it("should get a message that only school administrators can write post and return 404 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send({
            userId: mockUser.userId,
            schoolName: mockSchool.schoolName,
            region: mockSchool.region,
            contents: "test post!",
            type: "notice"
          })
          .end((err, res) => {
            expect(res).to.have.status(404)
            done()
          })
      })
    })
  })
})
