const router = require("express").Router()
const Post = require("../models/post")
const User = require("../models/user")
const School = require("../models/school")
const Follow = require("../models/follow")
const paramHandler = require("../helpers/paramHandler")
const whiteList = ["userId", "contents", "type", "schoolName", "region"]

router.get("/", async (req, res) => {
  try {
    const post = await Post.findAll()
    return res
      .status(200)
      .send({ success: true, message: "Registered post search success.", data: post })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.post("/", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList)
    const user = await User.findOneByUserId(params.userId)
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${params.userId}' user is not registered.` })

    const school = await School.findOneBySchoolInfo({
      schoolName: params.schoolName,
      region: params.region
    })
    if (!school)
      return res
        .status(401)
        .send({ success: false, message: `'${params.schoolName}' not a registered school` })

    const postType = ["general", "notice"]
    if (params.type && postType.indexOf(params.type.toLowerCase()) < 0)
      return res.status(404).send({ success: false, message: "Type does not exist." })
    if (params.userId !== school.owner && params.type.toLowerCase() === "notice")
      return res
        .status(404)
        .send({ success: false, message: "Only school administrators can write." })

    const newPost = await Post.create({
      contents: params.contents,
      creator: user._id,
      from: school._id,
      type: params.type
    })
    return res
      .status(200)
      .send({ success: true, message: "Post registration was successful.", data: newPost })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

//todo(jhkim) offset / limit 도 전달 받을 수있도록 수정 필요
router.get("/:userId", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.params, whiteList)
    const user = await User.findOneByUserId(params.userId)
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${params.userId}' user is not registered.` })

    const follows = await Follow.findByUserId({ userId: user._id })
    if (!follows)
      return res.status(401).send({ success: false, message: "There are no schools to subscribe." })

    let postList = []
    for (let follow of follows) {
      let endTime = follow.endFollow === null ? Date.now() : follow.endFollow
      let posts = await Post.findPosts({
        from: follow.subscribeTo._id,
        createTime: { $gte: follow.startFollow, $lt: endTime }
      })
        .populate({ path: "creator", select: "-_id userId" })
        .populate({ path: "from", select: "-_id region schoolName" })
      if (posts) postList.push(...posts)
    }
    return res
      .status(200)
      .send({ success: true, message: "Registered post search success.", data: postList })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

module.exports = router
