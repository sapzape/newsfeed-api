/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: 학교 데이터 관련 API
 */
const router = require("express").Router()
const School = require("../models/school")
const paramHandler = require("../helpers/paramHandler")
const whiteList = ["owner", "region", "schoolName"]

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: 전체 등록된 학교 정보 조회
 *     tags: [Schools]
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
 *     summary: 학교 정보 등록
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: schoolName
 *         type: string
 *         description: |
 *          등록할 학교명
 *       - in: query
 *         name: region
 *         type: string
 *         description: |
 *          학교가 위치한 지역
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
    const school = await School.findAll()
    return res
      .status(200)
      .send({ success: true, message: "Registered schools search successful.", data: school })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

router.post("/", async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList)
    const checkSchool = await School.findOneBySchoolInfo({
      schoolName: params.schoolName,
      region: params.region
    })
    if (checkSchool)
      return res
        .status(404)
        .send({ success: false, message: `${params.schoolName} school is already enrolled.` })

    const school = await School.create(params)

    return res
      .status(200)
      .send({ success: true, message: "Successful creation of school information.", data: school })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() })
  }
})

module.exports = router
