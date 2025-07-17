const mongoose = require('mongoose');

//this is user file
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

module.exports = mongoose.model('User', UserSchema);