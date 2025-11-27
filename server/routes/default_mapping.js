const express = require('express');
const DefaultMapping = require('../models/DefaultMappingSchema');
const router = express.Router();


// GET the default mapping.
router.get('/', async (req, res) => {
  try {
    const mapping = await DefaultMapping.findOne({  name: "default"  });
    if (!mapping) {
      return res.status(404).json({ message: "Mapping not found."});
    }
    res.json(mapping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create the default mapping
router.post('/', async (req, res) => {
  const mapping = new DefaultMapping({
    name: req.body.name,
    mapping: req.body.mapping
  });

  try {
    const newMapping = await mapping.save();
    res.status(201).json(newMapping);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Why '/default'??
// The Express router only uses the path (/default) to decide which function to execute. 
// Once your function runs, it's completely separate from the URI.
// Inside your function, you must tell Mongoose how to find the single document to update.
router.patch('/default', async (req, res) => {
  try {
    // Use findOneAndUpdate() instead of findByIdAndUpdate().
    const updatedDefaultMapping = await DefaultMapping.findOneAndUpdate(
      // Find the document where name is "default"
      { name: "default" },
      {
        // Use $set to update specific fields within the document
        $set : {
          name: req.body.name,
          mapping: req.body.mapping
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedDefaultMapping) {
      return res.status(404).json({ message: "Default mapping document not found" });
    }
    res.json(updatedDefaultMapping);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;
