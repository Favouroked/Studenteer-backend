const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor'},
    student: { type: Schema.Types.ObjectId, ref: 'Student'},
    stars: { type: Number }
});

const Rating = module.exports = mongoose.model('Rating', RatingSchema);