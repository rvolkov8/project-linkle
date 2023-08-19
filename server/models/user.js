const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatarFileName: { type: String, default: null },
  bio: { type: String, default: null },
  education: [{ type: String, default: null }],
  currentCity: { type: String, default: null },
  homeTown: { type: String, default: null },
  education: [{ type: String }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  isOnline: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
