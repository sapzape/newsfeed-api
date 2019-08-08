const router = require('express').Router();
const User = require('../models/user');
const School = require('../models/school');
const Follow = require('../models/follow');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['userId', 'post', 'likeSchool', 'schoolName'];

// 유저 조회
router.get('/:userId', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.params, whiteList);
    const user = await User.findOneByUserId(params.userId);
    if (!user) return res.status(404).send({ err: 'User not found' });

    return res.status(200).send({ success: true, message: '', data: user });
  } catch(err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

// 유저 생성
router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const newUser = await User.create(params);

    return res.status(201).send({ success: true, message: 'User Successfully created', data: newUser });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

router.put('/:userId/likes', async (req, res) => {
 try {
   const params = paramHandler.filterParams(req.body, whiteList);
   const user = await User.findOneByUserId(req.params.userId);
   if (!user) res.status(404).send('존재하지 않는 사용자입니다.');
   
   const school = await School.findOneBySchoolName(params.schoolName);
   if (!school) res.status(404).send('존재하지 않는 학교명입니다.');
   
   const findFollow = await Follow.findByUserId({userId: user._id, subscribeTo: school._id}).populate('userId').populate('subscribeTo');
   if (findFollow && findFollow.endFollow === null) {
    return res.status(404).send('이미 구독중인 학교입니다.');
   }
   if (findFollow && findFollow.endFollow) {
    const updateFollow = await Follow.updateFollow({userId: user._id, subscribeTo: school._id}, {startFollow: Date.now(), endFollow: null});
    return res.status(201).send({ success: true, message: '다시 구독 시작', data: updateFollow });
   }
   const newFollow = await Follow.create({userId: user._id, subscribeTo: school._id, startFollow: Date.now(), endFollow: null});

   return res.status(201).send({ success: true, message: '구독 성공', data: newFollow });
 } catch (err) {
   return res.status(500).send({ success: false, message: err.toString() });
 }
});

router.put('/:userId/unlikes', async (req, res) => {
 try {
   const params = paramHandler.filterParams(req.body, whiteList);
   const user = await User.findOneByUserId(req.params.userId);
   if (!user) res.status(404).send('존재하지 않는 사용자입니다.');

   const school = await School.findOneBySchoolName(params.schoolName); 
   if (!school) return res.status(404).send('존재하지 않는 학교명입니다.');
   
   const findFollow = await Follow.findByUserId({userId: user._id, subscribeTo: school._id}).populate('userId').populate('subscribeTo'); 
   if (!findFollow) return res.status(404).send('구독하지 않은 학교입니다.');
   if (findFollow.endFollow !== null) return res.status(404).send('이미 구독해제한 학교입니다.');
   const updateFollow = await Follow.updateFollow({userId: user._id, subscribeTo: school._id}, {endFollow: Date.now()});

   return res.status(201).send({ success: true, message: '구독 해제 성공', data: updateFollow });
 } catch (err) {
   return res.status(500).send({ success: false, message: err.toString() });
 }
});

module.exports = router;