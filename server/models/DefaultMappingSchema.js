const mongoose = require('mongoose');

const mapItemSchema = new mongoose.Schema({
  number: String,
  emoji: String,
  explanation: String
}, { _id: false });

const defaultMappingSchema = new mongoose.Schema({
  name: String,               // e.g. "default"
  mapping: {
    type: [mapItemSchema],
    default: []
  }
});

module.exports = mongoose.model('DefaultMapping', defaultMappingSchema);