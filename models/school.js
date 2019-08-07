const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  owner: { type: String, required: true },
  rigion: { type: String, required: true },
  schoolName: { type: String, required: true, unique: true },
  createTime: { type: Date, default: Date.now }
});

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