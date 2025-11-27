const mongoose = require('mongoose');

const nextUserIdSchema = new mongoose.Schema({
// I attempted to omit _id by adding { _id: false }
// But Mongoose still needs some unique key to track the
// document within its own framework and for certain operations.
// I need to designate one of your other fields as the document's 
// primary key by setting its required property to true and its 
// unique property to true.
  nextUserId: Number
});

module.exports = mongoose.model('NextUserId', nextUserIdSchema);