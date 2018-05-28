const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    fullname: { type: String },
    email: { type: String },
    password: { type: String },
    courses: []
});

const Instructor = module.exports = mongoose.model('Instructor', InstructorSchema);