const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../../../app")
const expect = chai.expect

const User = require("../../../models/user")
const School = require("../../../models/school")
const Follow = require("../../../models/follow")
const Post = require("../../../models/post")
const userFactory = require("../../factories/userFactory")
const schoolFactory = require("../../factories/schoolFactory")
const followFactory = require("../../factories/followFactory")
const postFactory = require("../../factories/postFactory")

const ENDPOINT = "/posts"

let mockUser
let mockSchool
let mockPost

describe(`GET ${ENDPOINT}`, () => {
  before(async () => {
    chai.use(chaiHttp)

    await User.remove({})
    await School.remove({})
    await Follow.remove({})
    await Post.remove({})

    mockUser = await User.create(userFactory.generate())
    mockSchool = await School.create(schoolFactory.generate())

    let follow = followFactory.generate()
    follow.userId = mockUser._id
    follow.subscribeTo = mockSchool._id
    await Follow.create(follow)

    let post = postFactory.generate()
    post.creator = mockUser._id
    post.from = mockSchool._id
    mockPost = await Post.create(post)
  })

  describe("when sending the correct data", () => {
    describe(`GET ${ENDPOINT}/:userId`, () => {
      it("should get feeds from subscribe schools and return 200 status code", done => {
        chai
          .request(app)
          .get(`${ENDPOINT}/${mockUser.userId}`)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.data[0].creator.userId).to.be.equal(mockUser.userId)
            expect(res.body.data[0].from.region).to.be.equal(mockSchool.region)
            expect(res.body.data[0].from.schoolName).to.be.equal(mockSchool.schoolName)
            expect(res.body.data[0].contents).to.be.equal(mockPost.contents)
            done()
          })
      })

      it("should get a message that the user not exists and return 200 status code", done => {
        Follow.updateFollow(
          { userId: mockUser._id, subscribeTo: mockSchool._id },
          { endFollow: Date.now() }
        ).then(() => {
          chai
            .request(app)
            .get(ENDPOINT + "/" + mockUser.userId)
            .end((err, res) => {
              expect(res).to.have.status(200)
              expect(res.body.data[0].creator.userId).to.be.equal(mockUser.userId)
              expect(res.body.data[0].from.region).to.be.equal(mockSchool.region)
              expect(res.body.data[0].from.schoolName).to.be.equal(mockSchool.schoolName)
              expect(res.body.data[0].contents).to.be.equal(mockPost.contents)
              done()
            })
        })
      })
    })
  })
})
