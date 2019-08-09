const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  owner: { type: String, required: true },
  region: { type: String, required: true },
  schoolName: { type: String, required: true },
  createTime: { type: Date, default: Date.now }
});

schoolSchema.index({region: 1, schoolName: 1}, {unique: true});

schoolSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

schoolSchema.statics.findAll = function () {
  return this.find({});
};

schoolSchema.statics.findOneBySchoolInfo = function(schoolInfo) {
  return this.findOne(schoolInfo);
};

schoolSchema.statics.updateBySchoolInfo = function (schoolInfo, payload) {
  return this.findOneAndUpdate(schoolInfo, payload, { new: true });
};

schoolSchema.statics.deleteBySchoolInfo = function (schoolInfo) {
  return this.remove(schoolInfo);
};

module.exports = mongoose.model('School', schoolSchema);