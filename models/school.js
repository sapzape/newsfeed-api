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

schoolSchema.statics.findOneBySchoolName = function(schoolName) {
  return this.findOne({ schoolName });
};

schoolSchema.statics.updateBySchoolName = function (schoolName, payload) {
  return this.findOneAndUpdate({ schoolName }, payload, { new: true });
};

schoolSchema.statics.deleteBySchoolName = function (schoolName) {
  return this.remove({ schoolName });
};

module.exports = mongoose.model('School', schoolSchema);