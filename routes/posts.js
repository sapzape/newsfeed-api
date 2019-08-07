const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');
const School = require('../models/school');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['userId', 'schoolName', 'contents'];

// 글 조회
router.get('/', async (req, res) => {
  try {
    const post = await Post.findAll()
    if (!post) return res.status(404).send({ err: 'Post not found' });
    res.status(200).send({ success: true, message: '', data: post });
  } catch(err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

// 글쓰기
router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const user = await User.findOneByUserId(params.userId)
    if (!user) res.status(404).send({ success: false, message: "User not found", data: null });

    const school = await School.findOneBySchoolName(params.schoolName);
    if (!school) res.status(404).send({ success: false, message: "School not found", data: null });

    const newPost = await Post.create(params);
    res.status(201).send({ success: true, message: 'Post Successfully created', data: newPost });
  } catch (err) {
    res.status(500).send({ success: false, message: err.toString() });
  }
});

module.exports = router;