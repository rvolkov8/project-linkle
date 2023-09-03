const { validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const requestedFields = req.query.fields;

    const decodedToken = jwt.decode(token);
    const userData = await User.findById({ _id: decodedToken.id })
      .populate({ path: 'friends', model: 'User' })
      .exec();

    if (requestedFields) {
      const requestedFieldsArr = requestedFields.split(',');
      const filteredUser = requestedFieldsArr.reduce((obj, field) => {
        if (userData[field] !== undefined) {
          obj[field] = userData[field];
        }
        return obj;
      }, {});
      return res.status(200).json(filteredUser);
    }

    res.status(200).json(userData);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to get current user data: ', err);
  }
};

exports.postUploadPost = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ msg: result.array()[0].msg });
    }

    const postBody = req.body.body;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const post = new Post({
      author: userId,
      body: postBody,
    });
    if (req.file) {
      post.picture = req.file.filename;
    }
    await post.save();

    const user = await User.findById({ _id: userId }).exec();
    user.posts.push(post._id);
    await user.save();

    res.status(201).json(post._id);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to upload post: ', err);
  }
};

exports.postSharePost = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ msg: result.array()[0].msg });
    }

    const postBody = req.body.body && req.body.body;
    const sharedPostId = req.body.sharedPostId;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const post = new Post({
      author: userId,
      body: postBody,
      sharesPost: sharedPostId,
    });
    await post.save();

    const user = await User.findById({ _id: userId }).exec();
    user.posts.push(post._id);
    await user.save();

    const originalPost = await Post.findById({ _id: sharedPostId }).exec();
    originalPost.sharedBy.push(userId);
    originalPost.save();

    res.status(201).json(post._id);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to upload post: ', err);
  }
};

exports.postUploadComment = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ msg: result.array()[0].msg });
    }

    const commentBody = req.body.body;
    const postId = req.body.postId;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const comment = new Comment({
      author: userId,
      body: commentBody,
    });
    await comment.save();

    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: comment._id } }
    );

    res.sendStatus(201);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to upload comment: ', err);
  }
};

exports.getFeedPosts = async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const posts = await Post.find()
      .populate({
        path: 'author',
        model: 'User',
        select: 'firstName lastName fullName avatarFileName friends',
      })
      .populate({
        path: 'sharesPost',
        model: 'Post',
        select: 'author body picture createdAt',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName avatarFileName',
        },
      })
      .populate({
        path: 'likedBy',
        model: 'User',
        select: 'fullName',
      })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName avatarFileName',
        },
      })
      .populate({
        path: 'sharedBy',
        model: 'User',
        select: 'fullName',
      })
      .limit(200)
      .exec();

    const friendsPosts = posts.filter((post) => {
      if (post.author && post.author.friends) {
        return post.author.friends.includes(userId);
      }
    });

    const sortedFriendsPosts = friendsPosts.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.status(200).json(sortedFriendsPosts);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to fetch feed posts: ', err);
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId })
      .populate({
        path: 'author',
        model: 'User',
        select: 'firstName lastName avatarFileName friends',
      })
      .populate({
        path: 'sharesPost',
        model: 'Post',
        select: 'author body picture createdAt',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName avatarFileName',
        },
      })
      .populate({
        path: 'likedBy',
        model: 'User',
        select: 'fullName',
      })
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName avatarFileName',
        },
      })
      .populate({
        path: 'sharedBy',
        model: 'User',
        select: 'fullName',
      })
      .exec();
    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to fetch post: ', err);
  }
};

exports.getSearchResults = async (req, res) => {
  try {
    const requestedRegEx = req.query.searchInput;
    const users = await User.find({
      fullName: { $regex: requestedRegEx, $options: 'i' },
    })
      .limit(10)
      .exec();

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to fetch search results: ', err);
  }
};

exports.patchLikePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const post = await Post.findOne({ _id: postId });
    if (!post.likedBy.includes(userId)) {
      post.likedBy.push(userId);
    } else {
      res.status(400).json('The post is already liked.');
    }
    await post.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to like a post: ', err);
  }
};

exports.patchUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const post = await Post.findOne({ _id: postId });
    const newLikedBy = post.likedBy.filter((like) => {
      return !like.equals(userId);
    });
    post.likedBy = newLikedBy;
    await post.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to unlike a post: ', err);
  }
};

exports.patchUserOnline = async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const user = await User.findOne({ _id: userId });
    user.isOnline = true;
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to change user status: ', err);
  }
};

exports.patchUserOffline = async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const user = await User.findById({ _id: userId });
    user.isOnline = false;
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to change user status: ', err);
  }
};
