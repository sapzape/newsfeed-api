const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  contents: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  from: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "School"
  }
});

postSchema.statics.create = function (payload) {
  const user = new this(payload);
  return user.save();
};

postSchema.statics.findAll = function () {
  return this.find({});
};

postSchema.statics.findOneByUserId = function(userId) {
  return this.findOne({ userId });
};

postSchema.statics.findPosts = function(payload) {
  return this.find(payload).sort({date: -1}).limit(20);
};

postSchema.statics.updateByUserId = function (userId, payload) {
  return this.findOneAndUpdate({ userId }, payload, { new: true });
};

postSchema.statics.deleteByUserId = function (userId) {
  return this.remove({ userId });
};

module.exports = mongoose.model('Post', postSchema);