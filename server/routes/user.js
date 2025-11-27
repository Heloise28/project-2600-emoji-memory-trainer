const express = require('express');
const User = require('../models/UserSchema');
const router = express.Router();


// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const foundUser = await User.findOne({ userId: req.params.id });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found."});
    }

    res.json(foundUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a user
router.put('/create_user', async (req, res) => {
  const user = new User({
    userId: req.body.userId
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update mapping
router.patch('/update_mapping/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.id},
      { $set : {customMapping: req.body.customMapping} },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User with id ${req.params.id} not found.`});
    }
    res.json(updatedUser);
  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update saved numbers
router.patch('/update_saved_numbers/:id', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.id},
      { $set : {savedNumbers: req.body.savedNumbers} },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User with id ${req.params.id} not found.`});
    }
    res.json(updatedUser);
  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete
router.delete('/delete/:id', async (req, res) => {
  try {
    // Can't use findByIdAndDelete(req.params.id) here because I'm not using _id
    const deletedUser = await User.findOneAndDelete({ 
      userId: req.params.id // Query using the custom userId captured from the route
    });

    if (!deletedUser) {
      return res.status(404).json({ message: `User with id ${req.params.id} not found.` });
    }

    res.json({ message: "User deleted successfully.", deletedUser: deletedUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;