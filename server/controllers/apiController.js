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
      .select('-password -username')
      .populate({ path: 'friends', model: 'User' })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'author',
          model: 'User',
          select: 'firstName lastName fullName avatarFileName friends',
        },
      })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'sharesPost',
          model: 'Post',
          populate: {
            path: 'author',
            model: 'User',
            select: 'firstName lastName fullName avatarFileName friends',
          },
        },
      })
      .populate({
        path: 'friendRequests',
        populate: {
          path: 'user',
          model: 'User',
          select: 'fullName avatarFileName',
        },
      })
      .exec();

    userData.posts.sort((a, b) => b.createdAt - a.createdAt);

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

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestedFields = req.query.fields;

    const userData = await User.findById({ _id: id })
      .select('-password -username')
      .populate({ path: 'friends', model: 'User' })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'author',
          model: 'User',
          select: 'firstName lastName fullName avatarFileName friends',
        },
      })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'sharesPost',
          model: 'Post',
          populate: {
            path: 'author',
            model: 'User',
            select: 'firstName lastName fullName avatarFileName friends',
          },
        },
      })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'likedBy',
          model: 'User',
          select: 'fullName',
        },
      })
      .populate({
        path: 'posts',
        model: 'Post',
        populate: {
          path: 'sharedBy',
          model: 'User',
          select: 'fullName',
        },
      })
      .exec();

    userData.posts.sort((a, b) => b.createdAt - a.createdAt);

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
    console.log('Error when trying to get user data: ', err);
  }
};

exports.patchCurrentUser = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ msg: result.array()[0].msg });
    }

    const { firstName, lastName, bio, currentCity, homeTown } = req.body;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const user = await User.findOne({ _id: userId }).exec();
    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    user.bio = bio.trim();
    user.currentCity = currentCity.trim();
    user.homeTown = homeTown.trim();
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to patch current user: ', err);
  }
};

exports.patchRemoveFriend = async (req, res) => {
  try {
    const { friendId } = req.query;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const currentUser = await User.findOne({ _id: userId }).exec();
    const updatedUserFriends = currentUser.friends.filter(
      (friend) => !friend.equals(friendId)
    );
    currentUser.friends = updatedUserFriends;
    await currentUser.save();

    const friend = await User.findOne({ _id: friendId }).exec();
    const updatedFriendFriends = friend.friends.filter(
      (friend) => !friend.equals(userId)
    );
    friend.friends = updatedFriendFriends;
    await friend.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to remove friend: ', err);
  }
};

exports.patchSendFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const currentUserId = decodedToken.id;

    const user = await User.findOne({ _id: id }).exec();
    user.friendRequests.push({ user: currentUserId });
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to remove friend: ', err);
  }
};

exports.patchCancelFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const currentUserId = decodedToken.id;

    const user = await User.findOne({ _id: id }).exec();
    const updatedFriendRequests = user.friendRequests.filter(
      (request) => !request.user.equals(currentUserId)
    );
    user.friendRequests = updatedFriendRequests;
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to remove friend: ', err);
  }
};

exports.patchConfirmFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const currentUserId = decodedToken.id;

    const currentUser = await User.findOne({ _id: currentUserId }).exec();
    const updatedFriendRequests = currentUser.friendRequests.filter(
      (request) => !request.user.equals(id)
    );
    currentUser.friendRequests = updatedFriendRequests;
    currentUser.friends.push(id);
    await currentUser.save();

    const friend = await User.findOne({ _id: id }).exec();
    friend.friends.push(currentUserId);
    await friend.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to remove friend: ', err);
  }
};

exports.patchRemoveFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const currentUserId = decodedToken.id;

    const currentUser = await User.findOne({ _id: currentUserId }).exec();
    const updatedFriendRequests = currentUser.friendRequests.filter(
      (request) => !request.user.equals(id)
    );
    currentUser.friendRequests = updatedFriendRequests;
    await currentUser.save();

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to remove friend: ', err);
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

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { isOnline: true }
    );

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to change user status (online): ', err);
  }
};

exports.patchUserOffline = async (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { isOnline: false }
    );

    res.sendStatus(204);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Internal server error. Please, try again later.' });
    console.log('Error when trying to change user status (offline): ', err);
  }
};
