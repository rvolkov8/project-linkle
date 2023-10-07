const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String },
  pictureUrl: { type: String, default: null },
  sharesPost: { type: Schema.Types.ObjectId, default: null },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sharedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Post', postSchema);
