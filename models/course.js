const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {type: String},
    category: {type: String},
    description: {type: String},
    instructor: {type: Schema.Types.ObjectId, ref: 'User'},
    materials: [{type: String}],
    image: {type: String},
    students: [{type: Schema.Types.ObjectId, ref: 'User'}],
    ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}],
    rating_number: {type: Number}
});

CourseSchema.pre('save', (next)=> {
    console.log(`Saving the course with id ${JSON.stringify(this)}`);
    next();
});

const Course = module.exports = mongoose.model('Course', CourseSchema);