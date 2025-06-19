// model/profile.model.js

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullname: { type: String, trim: true, required: true },
  bio: { type: String, trim: true, required: true },
  imageUrl: { type: String }
}, {
  versionKey: false,
  timestamps: true
});

profileSchema.index({ userId: 1 }, { unique: true });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
