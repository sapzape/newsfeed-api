const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true, unique: true },
  position: { type: String, default: "student" },
  createTime: { type: Date, default: Date.now }
})

userSchema.statics.create = function(payload) {
  const user = new this(payload)
  return user.save()
}

userSchema.statics.findAll = function(userId) {
  return this.find({})
}

userSchema.statics.findOneByUserId = function(userId) {
  return this.findOne({ userId })
}

userSchema.statics.updateByUserId = function(userId, school) {
  return this.findOneAndUpdate({ userId }, { $addToSet: school }, { new: true })
}

userSchema.statics.unlikeByUserId = function(userId, school) {
  return this.findOneAndUpdate({ userId }, { $pull: school }, { new: true })
}

module.exports = mongoose.model("User", userSchema)
