/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 글 관련 API
 */
const router = require("express").Router()
const Post = require("../models/post")
const User = require("../models/user")
const School = require("../models/school")
const Follow = require("../models/follow")
const paramHandler = require("../helpers/paramHandler")
const whiteList = ["userId", "contents", "type", "schoolName", "region"]

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 전체 등록된 글(피드) 조회
 *     tags: [Posts]
 *     parameters:
 *     responses:
 *       200:
 *         description: OK - 처리 완료
 *       401:
 *         description: Unauthrized -인증되지 않은 사용자, 학교
 *       404:
 *         description: Not Found - 찾을 수 없음
 *       500:
 *         description: Internal server error -내부 서버 오류
 *   post:
 *     summary: 글(피드) 등록
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         type: string
 *         description: |
 *          글을 등록할 사용자 아이디
 *       - in: query
 *         name: schoolName
 *         type: string
 *         description: |
 *          글을 등록할 학교명
 *       - in: query
 *         name: region
 *         type: string
 *         description: |
 *          글을 등록할 학교 위치
 *       - in: query
 *         name: type
 *         type: string
 *         enum: [general, notice]
 *         description: |
 *          글 타입 (general - 일반글 / notice - 공지(관리자 전용))
 *       - in: query
 *         name: contents
 *         type: string
 *         description: |
 *          글 내용
 *     responses:
 *       200:
 *         description: OK - 처리 완료
 *       401:
 *         description: Unauthrized -인증되지 않은 사용자, 학교
 *       404:
 *         description: Not Found - 찾을 수 없음
 *       500:
 *         description: Internal server error -내부 서버 오류
 * /posts/{userId}:
 *   get:
 *     summary: 사용자가 구독중인 페이지의 글(피드) 정보 조회
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         type: string
 *         description: |
 *          사용자 아이디
 *     responses:
 *       200:
 *         description: OK - 처리 완료
 *       401:
 *         description: Unauthrized -인증되지 않은 사용자, 학교
 *       404:
 *         description: Not Found - 찾을 수 없음
 *       500:
 *         description: Internal server error -내부 서버 오류
 */
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
