const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Course = require('./course');

const RatingSchema = new Schema({
    instructor: {type: Schema.Types.ObjectId, ref: 'Instructor'},
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    student: {type: Schema.Types.ObjectId, ref: 'Student'},
    stars: {type: Number}
});

RatingSchema.post('save', (ratt) => {

    let courseId = ratt.course.toString();
    Course.findOne({_id: courseId}, (err, course) => {
        if (err) throw err;
        console.log('seeing 0');
        course.ratings.push(ratt._id);
        console.log("Reaching course find " + JSON.stringify(course));
        course.save((err1, course1) => {
            if (err1) throw err1;
            if (course1) {
                console.log('seeing 1');
                Course.findOne({_id: courseId})
                    .populate('ratings')
                    .exec((err2, course2) => {
                        console.log('seeing 2');
                        if (err2) throw err;
                        if (course2) {
                            console.log(`Reaching save course after rate course ${JSON.stringify(course2)}`);
                            let ratings = course2.ratings;
                            let totalCount = 0;
                            if (ratings.length > 0) {
                                ratings.forEach(rating => {
                                    totalCount += rating.stars;
                                });
                            }
                            course2.rating_number = (totalCount / ratings.length);
                            // console.log(`Reaching save course after rate course ${JSON.stringify(course1)}`);
                            console.log(`Reaching save course after rate course ${course2}`);
                            course2.save((err3, course3) => {
                                if (err2) throw err2;
                                if (course2) {
                                }
                            })
                        }
                    });
            }
        })
    });


});

const Rating = module.exports = mongoose.model('Rating', RatingSchema);