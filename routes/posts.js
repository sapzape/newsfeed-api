const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const School = require('../models/school');
const Follow = require('../models/follow');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['userId', 'contents', 'schoolName', 'region'];

router.get('/', async (req, res) => {
  try {
    const post = await Post.findAll()
    if (!post) return res.status(404).send({ err: 'Post not found' });
    
    return res.status(200).send({ success: true, message: '', data: post });
  } catch(err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const user = await User.findOneByUserId(params.userId)
    if (!user) return res.status(404).send({ success: false, message: "User not found", data: null });

    const school = await School.findOneBySchoolInfo({schoolName: params.schoolName, region: params.region});
    if (!school) return res.status(404).send({ success: false, message: "School not found", data: null });

    const newPost = await Post.create({contents: params.contents, creator: user._id, from: school._id});
    return res.status(201).send({ success: true, message: 'Post Successfully created', data: newPost });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

//todo(jhkim) offset / limit 도 전달 받을 수있도록 수정 필요
router.get('/:userId', async (req, res) => {
 try {
   const params = paramHandler.filterParams(req.params, whiteList);
   const user = await User.findOneByUserId(params.userId);
   if (!user) return res.status(404).send({ err: 'User not found' });

   const follows = await Follow.findByUserId({userId: user._id});
   if (!follows) return res.status(404).send({ err: '구독 중인 학교 없음' });

   let postList = [];
   for (let follow of follows) {
    let endTime = (follow.endFollow === null) ? Date.now() : follow.endFollow;
    let posts = await Post.findPosts({from: follow.subscribeTo._id, createTime: {"$gte": follow.startFollow, "$lt": endTime}}).populate({path: 'creator', select: '-_id userId'}).populate({path: 'from', select: '-_id region schoolName'});
     if (posts) postList.push(...posts);
   }
   return res.status(201).send({ success: true, message: 'Post 조회', data: postList });
 } catch (err) {
   return res.status(500).send({ success: false, message: err.toString() });
 }
});

module.exports = router;