const router = require("express").Router()
const User = require("../models/user")
const School = require("../models/school")
const Follow = require("../models/follow")
const paramHandler = require("../helpers/paramHandler")
const whiteList = ["userId", "position", "schoolName", "region"]

router.get("/", async (req, res) => {
  try {
    const user = await User.findAll()
    return res
      .status(200)
      .send({ success: true, message: "Registered users search successful.", data: user })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.get("/:userId", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.params, whiteList)
    const user = await User.findOneByUserId(params.userId).select("-_id userId position")
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${params.userId}' user is not registered.` })

    return res
      .status(200)
      .send({ success: true, message: "Registered user search successful.", data: user })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.post("/", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList)
    const user = await User.findOneByUserId(params.userId)
    if (user)
      return res
        .status(404)
        .send({ success: false, message: `'${params.userId}' user is already registered.` })

    const position = ["student", "teacher", "parent"]
    if (params.position && position.indexOf(params.position.toLowerCase()) < 0)
      return res.status(404).send({ success: false, message: "Position does not exist." })

    const newUser = await User.create(params)

    return res
      .status(200)
      .send({ success: true, message: "Successful creation of user information.", data: newUser })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.get("/:userId/likes", async (req, res) => {
  try {
    const user = await User.findOneByUserId(req.params.userId)
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${req.params.userId}' user is not registered.` })

    const follows = await Follow.findByUserId({ userId: user._id })
      .populate({ path: "userId", select: "-_id userId position" })
      .populate({ path: "subscribeTo", select: "-_id region schoolName" })
      .select("-_id")

    return res
      .status(200)
      .send({ success: true, message: "Subscribed school list search successful.", data: follows })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.put("/:userId/likes", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList)
    const user = await User.findOneByUserId(req.params.userId)
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${req.params.userId}' user is not registered.` })

    const school = await School.findOneBySchoolInfo({
      schoolName: params.schoolName,
      region: params.region
    })
    if (!school)
      res
        .status(401)
        .send({ success: false, message: `'${params.schoolName}' not a registered school.` })

    const findFollow = await Follow.findOneByUserId({ userId: user._id, subscribeTo: school._id })
    if (findFollow && findFollow.endFollow === null) {
      return res.status(404).send({ success: false, message: "Already subscribed to this school." })
    }
    if (findFollow && findFollow.endFollow) {
      const updateFollow = await Follow.updateFollow(
        { userId: user._id, subscribeTo: school._id },
        { startFollow: Date.now(), endFollow: null }
      )
      return res
        .status(200)
        .send({ success: true, message: "Start subscription again.", data: updateFollow })
    }
    const newFollow = await Follow.create({
      userId: user._id,
      subscribeTo: school._id,
      startFollow: Date.now(),
      endFollow: null
    })

    return res
      .status(200)
      .send({ success: true, message: "Subscription successful.", data: newFollow })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.put("/:userId/unlikes", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList)
    const user = await User.findOneByUserId(req.params.userId)
    if (!user)
      return res
        .status(401)
        .send({ success: false, message: `'${req.params.userId}' user is not registered.` })

    const school = await School.findOneBySchoolInfo({
      schoolName: params.schoolName,
      region: params.region
    })
    if (!school)
      return res
        .status(401)
        .send({ success: false, message: `'${params.schoolName}' not a registered school` })

    const findFollow = await Follow.findOneByUserId({ userId: user._id, subscribeTo: school._id })
    if (!findFollow)
      return res.status(404).send({ success: false, message: "Not subscribed to this school." })
    if (findFollow.endFollow !== null)
      return res
        .status(404)
        .send({ success: false, message: "This school has already been unsubscribed." })
    const updateFollow = await Follow.updateFollow(
      { userId: user._id, subscribeTo: school._id },
      { endFollow: Date.now() }
    )

    return res
      .status(200)
      .send({ success: true, message: "Unsubscribe successful.", data: updateFollow })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

module.exports = router
