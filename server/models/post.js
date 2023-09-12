const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String },
  pictureUrl: { type: String, default: null },
  sharesPost: { type: Schema.Types.ObjectId, default: null },
  comments: [{ type: Schema.Types.ObjectId, red: 'Comment' }],
  likedBy: [{ type: Schema.Types.ObjectId, red: 'User' }],
  sharedBy: [{ type: Schema.Types.ObjectId, red: 'User' }],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Post', postSchema);
