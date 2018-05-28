const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    student: { type: Schema.Types.ObjectId, ref: 'Student'},
    questions: []
});

const Survey = module.exports = mongoose.model('Survey', SurveySchema);