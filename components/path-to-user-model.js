const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Definiáld a felhasználó séma mezőit itt
});

const User = mongoose.model('User', userSchema);

module.exports = User;
