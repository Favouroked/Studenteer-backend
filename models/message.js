const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    body: {type: String},
    timestamp: {type: Number}
});

const Message = module.exports = mongoose.model('Message', MessageSchema);