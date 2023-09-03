const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postSignUp = async (req, res) => {
  try {
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
        return res.status(400).json({ step: 1, msg: result.array()[0].msg });
      } else {
        return res.status(400).json({ step: 3, msg: result.array()[0].msg });
      }
    }

    const {
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
      currentCity,
      hometown,
    } = req.body;

    if (await User.findOne({ username: username })) {
      return res
        .status(400)
        .json({ step: 1, msg: 'A user with this username already exists.' });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ step: 1, msg: `Password and confirm password don't match.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    if (req.file) {
      user.avatarFileName = req.file.filename;
    }
    if (currentCity) {
      user.currentCity = currentCity;
    }
    if (hometown) {
      user.hometown = hometown;
    }
    await user.save();
    res.sendStatus(201);
  } catch (err) {
    res
      .status(500)
      .json({ step: 1, msg: 'Internal sever error. Please, try again later.' });
    console.log('Error when trying to sign up: ', err);
  }
};

exports.postLogIn = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ msg: result.array()[0].msg });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(401)
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
  } catch (err) {}
};
