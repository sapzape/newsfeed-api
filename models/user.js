const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true, unique: true },
  createTime: { type: Date },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  likeSchool: [{
    id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School"
  },
  createTime: { type: Date, default: Date.now },
  deleteTime: { type: Date, default: null },
  }]
});

userSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

userSchema.statics.findAll = function () {
  return this.find({});
};

userSchema.statics.findOneByUserId = function(userId) {
  return this.findOne({ userId });
};

userSchema.statics.updateByUserId = function (userId, payload) {
  return this.findOneAndUpdate({ userId }, payload, { new: true });
};

userSchema.statics.deleteByUserId = function (userId) {
  return this.remove({ userId });
};

module.exports = mongoose.model('User', userSchema);