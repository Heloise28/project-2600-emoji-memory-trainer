const mongoose = require('mongoose');

const customMapItemSchema = new mongoose.Schema({
  number: String,       
  emoji: String,        
  explanation: String   
}, { _id: false });

const savedNumberSchema = new mongoose.Schema({
  number: String,       
  title: String         
}, { _id: false });

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,   // user must have a username
    unique: true,     // no two users share the same username
    trim: true        // removes whitespace
  },

  customMapping: {
    type: [customMapItemSchema], // an array of custom mappings
    default: []                  // start empty
  },

  savedNumbers: {
    type: [savedNumberSchema],   // array of saved test numbers
    default: []                  // also start empty
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);