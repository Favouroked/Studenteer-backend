const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {type: String},
    category: {type: String},
    description: {type: String},
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    materials: [{type: String}],
    students: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

const Course = module.exports = mongoose.model('Course', CourseSchema);