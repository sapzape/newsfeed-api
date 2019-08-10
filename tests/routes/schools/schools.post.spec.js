const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../../app")
const expect = chai.expect

const School = require("../../../models/school")
const schoolFactory = require("../../factories/schoolFactory")

const ENDPOINT = "/schools"

let mockSchool

describe(`POST ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)
    await School.remove({})
    mockSchool = await School.create(schoolFactory.generate())
  })

  describe("when sending the not exists school information", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should regist new school information and return 200 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send(schoolFactory.generate())
          .end((err, res) => {
            expect(res).to.have.status(200)
            done()
          })
      })
    })
  })

  describe("when sending the exists school information", () => {
    describe(`POST ${ENDPOINT}`, () => {
      it("should get a message that the school already exists and return 404 status code", done => {
        chai
          .request(app)
          .post(ENDPOINT)
          .send(mockSchool)
          .end((err, res) => {
            expect(res).to.have.status(404)
            done()
          })
      })
    })
  })
})
