const router = require('express').Router();
const School = require('../models/school');
const paramHandler = require('../helpers/paramHandler');
const whiteList = ['owner', 'region', 'schoolName'];

router.get('/', async (req, res) => {
  try {
    const school = await School.findAll()
    return res.status(200).send({ success: true, message: 'Registered schools search successful.', data: school });
  } catch(err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

router.post('/', async (req, res) => {
  try {
    const params = paramHandler.filterParams(req.body, whiteList);
    const checkSchool = await School.findOneBySchoolInfo({schoolName: params.schoolName, region: params.region});
    if (checkSchool) return res.status(404).send({ success: false, message: `${params.schoolName} school is already enrolled.`});

    const school = await School.create(params);

    return res.status(200).send({ success: true, message: 'Successful creation of school information.', data: school });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.toString() });
  }
});

module.exports = router;