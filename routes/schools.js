const router = require('express').Router();
const School = require('../models/school');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['owner', 'region', 'schoolName'];

router.get('/', async (req, res) => {
  try {
    const school = await School.findAll()
    if (!school) return res.status(404).send({ err: 'School not found' });
    
    return res.status(200).send({ success: true, message: '', data: school });
  } catch(err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const checkSchool = await School.findOneBySchoolInfo({schoolName: params.schoolName, region: params.region});
    if (checkSchool) return res.status(404).send({ success: false, message: "이미 존재하는 학교", data: null });

    const school = await School.create(params);

    return res.status(201).send({ success: true, message: 'School Successfully created', data: school });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

module.exports = router;