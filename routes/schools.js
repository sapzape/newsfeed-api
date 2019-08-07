const router = require('express').Router();
const School = require('../models/school');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['owner', 'rigion', 'schoolName'];

// 학교 조회
router.get('/', async (req, res) => {
  try {
    const school = await School.findAll()
    if (!school) return res.status(404).send({ err: 'School not found' });
    res.status(200).send({ success: true, message: '', data: school });
  } catch(err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

// 학교 페이지 생성
router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const school = await School.create(params);
    res.status(201).send({ success: true, message: 'School Successfully created', data: school });
  } catch (err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

module.exports = router;