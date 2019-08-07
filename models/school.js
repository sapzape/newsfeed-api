const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  owner: { type: String, required: true },
  rigion: { type: String, required: true },
  schoolName: { type: String, required: true, unique: true },
  createTime: { type: Date, default: Date.now }
});

// Create new user document
schoolSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

// Find all
schoolSchema.statics.findAll = function () {
  return this.find({});
};

// Find one by SchoolName
schoolSchema.statics.findOneBySchoolName = function(schoolName) {
  return this.findOne({ schoolName });
};

// Update by SchoolName
schoolSchema.statics.updateBySchoolName = function (schoolName, payload) {
  return this.findOneAndUpdate({ schoolName }, payload, { new: true });
};

// Delete by SchoolName
schoolSchema.statics.deleteBySchoolName = function (schoolName) {
  return this.remove({ schoolName });
};

// Create model & export
module.exports = mongoose.model('School', schoolSchema);