const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subscribeTo: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "School"
  },
  startFollow: Date,
  endFollow: Date
});

followSchema.index({userId: 1, subscribeTo: 1}, {unique: true});

// Create new user document
followSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

// Find all
followSchema.statics.findAll = function () {
  return this.find({});
};

// Find one by UserId
followSchema.statics.findByUserId = function(payload) {
  return this.findOne(payload);
};

// Update by UserId
followSchema.statics.updateFollow = function (select, payload) {
  return this.findOneAndUpdate(select, payload, { new: true });
};

// Delete by UserId
followSchema.statics.deleteByUserId = function (userId) {
  return this.remove({ userId });
};

// Create model & export
module.exports = mongoose.model('Follow', followSchema);