const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignUp = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errStepOne = result.array().some((err) => {
      return (
        err.path === 'username' ||
        err.path === 'password' ||
        err.path === 'confirmPassword'
      );
    });

    if (errStepOne) {
      return res
        .status(400)
        .json({ step: 1, msg: 'Username and password are required.' });
    } else {
      return res
        .status(400)
        .json({ step: 2, msg: 'First and last name is required.' });
    }
  }

  const {
    username,
    password,
    confirmPassword,
    profilePicture,
    firstName,
    lastName,
  } = req.body;

  if (await User.findOne({ username: username })) {
    return res
      .status(400)
      .json({ msg: 'A user with this username already exists.' });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: `Password and confirm password don't match.` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username: username,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName,
  });
  if (profilePicture) {
    user.profilePicture = profilePicture;
  }
  await user.save();
  res.sendStatus(201);

  try {
  } catch (err) {
    console.log('Error when trying to sing up: ', err);
  }
};

exports.postLogIn = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res
        .status(400)
        .json({ step: 1, msg: 'Username and password are required.' });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: `A user with this username doesn't exists.` });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const opts = {
        expiresIn: '7d',
      };
      const token = jwt.sign(
        { username, id: user._id },
        process.env.JWT_SECRET,
        opts
      );
      return res.status(200).json({ msg: 'Auth passed', token: token });
    } else {
      return res.status(401).json({
        msg: `Sorry, your password was incorrect. Please double-check your password.`,
      });
    }

    return res.status(401).json({ msg: 'Auth failed' });
  } catch (err) {
    console.log('Error when trying to log in: ', err);
  }
};
