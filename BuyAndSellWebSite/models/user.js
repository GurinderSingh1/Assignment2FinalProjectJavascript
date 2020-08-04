const mongoose = require('mongoose');

//Create the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});
//Create, instantiate and export model with schema
const User = mongoose.model("User", UserSchema);
module.exports = User;