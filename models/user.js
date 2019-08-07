const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true, unique: true },
  createTime: { type: Date, default: Date.now },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  likeSchool: [{
    school : {type: mongoose.Schema.Types.ObjectId, ref: "School"},
    createTime: { type: Date },
    endTime: { type: Date }
  }]
});

// Create new user document
userSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

// Find one by UserId
userSchema.statics.findOneByUserId = function(userId) {
  return this.findOne({ userId });
};

// Update by UserId
userSchema.statics.updateByUserId = function (userId, school) {
  return this.findOneAndUpdate({ userId }, {$addToSet: school}, { new: true });
};

// Update by UserId
userSchema.statics.unlikeByUserId = function (userId, school) {
  return this.findOneAndUpdate({ userId }, {$pull: school}, { new: true });
};

// Create model & export
module.exports = mongoose.model('User', userSchema);