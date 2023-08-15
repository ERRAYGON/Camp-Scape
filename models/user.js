const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
// It'll add on a field to take input as username, password. 
// It'll make sure this usernames are unique and it also provide addtional methods

module.exports = mongoose.model('User', UserSchema);


