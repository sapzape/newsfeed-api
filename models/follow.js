const mongoose = require("mongoose")

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
})

followSchema.index({ userId: 1, subscribeTo: 1 }, { unique: true })

followSchema.statics.create = function(payload) {
  const user = new this(payload)
  return user.save()
}

followSchema.statics.findAll = function() {
  return this.find({})
}

followSchema.statics.findOneByUserId = function(payload) {
  return this.findOne(payload)
}

followSchema.statics.findByUserId = function(payload) {
  return this.find(payload)
}

followSchema.statics.updateFollow = function(select, payload) {
  return this.findOneAndUpdate(select, payload, { new: true })
}

followSchema.statics.deleteByUserId = function(userId) {
  return this.remove({ userId })
}

module.exports = mongoose.model("Follow", followSchema)
