const express = require('express');
const User = require('../models/UserSchema');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const foundUser = await User.findOne({ userId: req.body.userId });

    if (!foundUser) {
      return res.status(404).json({ userExists: false, message: "User doesn't exist."});
    }

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;