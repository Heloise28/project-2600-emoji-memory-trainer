const express = require('express');
const NextUserId = require('../models/NextUserIdSchema');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nextId = await NextUserId.find();
    res.json(nextId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  const nextId = new NextUserId({
    nextUserId: req.body.nextUserId,
  });
  try {
    const newId = await nextId.save();
    res.status(201).json(newId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.patch('/update', async (req, res) => {
  try {
    const updatedNextUserId = await NextUserId.findOneAndUpdate(
      // When you use an empty query object ({}) with findOneAndUpdate(), 
      // Mongoose will simply select the first document it finds 
      // in that collection. Since you are certain there is only 
      // one document, this reliably targets it.
      {},
      {
        $set : {
          nextUserId: req.body.nextUserId
        }
      },
      { new: true }
    );
    res.json(updatedNextUserId);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;