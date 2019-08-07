const router = require('express').Router();
const User = require('../models/user');
const School = require('../models/school');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['userId', 'post', 'likeSchool', 'schoolName'];

// 유저 조회
router.get('/:userId', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.params, whiteList);
    const user = await User.findOneByUserId(params.userId);
    if (!user) return res.status(404).send({ err: 'User not found' });
    res.status(200).send({ success: true, message: '', data: user });
  } catch(err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

// 유저 생성
router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const newUser = await User.create(params);
    res.status(201).send({ success: true, message: 'User Successfully created', data: newUser });
  } catch (err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

module.exports = router;