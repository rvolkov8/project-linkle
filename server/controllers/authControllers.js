const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

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

  const { username, password, confirmPassword, firstName, lastName } = req.body;

  if (await User.findOne({ username: username })) {
    console.log(await User.findOne({ username: username }));
    return res
      .status(400)
      .json({ msg: 'A user with this username already exists.' });
  }
  if (password !== confirmPassword) {
    console.log(await User.findOne({ username: username }));
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
  await user.save();
  res.sendStatus(201);

  try {
  } catch (err) {
    console.log('Error when trying to sing up: ', err);
  }
};
