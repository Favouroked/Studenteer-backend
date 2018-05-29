const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String},
    password: {type: String},
    is_instructor: {type: String},
    profile_pic: {type: String},
    city: {type: String},
    state: {type: String},
    phone_number: {type: String},
    courses: [{type: Schema.Types.ObjectId, ref: 'StudentCourse'}]
});

const User = module.exports = mongoose.model('User', UserSchema);

