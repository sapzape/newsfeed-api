const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const School = require('../models/school');
const Follow = require('../models/follow');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['userId', 'schoolName', 'contents'];

router.get('/', async (req, res) => {
  try {
    const post = await Post.findAll()
    if (!post) return res.status(404).send({ err: 'Post not found' });
    res.status(200).send({ success: true, message: '', data: post });
  } catch(err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const user = await User.findOneByUserId(params.userId)
    if (!user) res.status(404).send({ success: false, message: "User not found", data: null });

    const school = await School.findOneBySchoolName(params.schoolName);
    if (!school) res.status(404).send({ success: false, message: "School not found", data: null });

    const newPost = await Post.create({contents: params.contents, creator: user._id, from: school._id});
    res.status(201).send({ success: true, message: 'Post Successfully created', data: newPost });
  } catch (err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

//todo(jhkim) 구독 중인 학교 별로 조회시, 구독 시작/ 종료 시점 조건 추가 필요
//todo(jhkim) offset / limit 설정 필요
router.get('/:userId', async (req, res) => {
 try {
   const params = paramHandler.filterParams(req.params, whiteList);
   const user = await User.findOneByUserId(params.userId);
   if (!user) return res.status(404).send({ err: 'User not found' });

   const follows = await Follow.findByUserId({userId: user._id}).populate('userId').populate('subscribeTo');
   if (!follows) res.status(404).send({ err: '구독 중인 학교 없음' });

   let postList = [];
   for (let follow of follows) {
    let posts = await Post.findPosts({from: follow.subscribeTo._id}).populate('creator').populate('from');
     if (posts) postList.push(...posts);
   }
   res.status(201).send({ success: true, message: 'Post 조회', data: postList });
 } catch (err) {
   res.status(500).send({ success: false, message: err.toString() });
 }
});

module.exports = router;