const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const StudentCourseSchema = new Schema({
    course_id: {type: Schema.Types.ObjectId},
    progress: {type: Number}
});

const StudentCourse = module.exports = mongoose.model('StudentCourse', StudentCourseSchema);