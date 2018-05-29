var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
const User = require('../models/student');
const Message = require('../models/message');
const Course = require('../models/course');
const StudentCourse = require('../models/studentcourse');
const Survey = require('../models/survey');
const Rating = require('../models/rating');

cloudinary.config({
    cloud_name: 'favouroked',
    api_key: '873861956361625',
    api_secret: 'HmZaNwpuQZjH-T-ut49Ltz_3vBQ'
});

var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "JAN",
    filename: function (req, file, cb) {
        var file_name = Date.now();
        cb(undefined, file_name);
    }
});

const upload = multer({storage: storage});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Welcome to the JAN Hackathon homepage');
});

router.post('/user/signup', upload.single('profile_pic'), (req, res) => {
    console.log(req.body);
    req.body.details = JSON.parse(req.body.details);

    let password = req.body.details.password;
    if (!password) {
        return res.json({error: "true", error_msg: "103"})
    }
    let first_name = req.body.details.first_name;
    if (!first_name) {
        return res.json({error: "true", error_msg: "103"})
    }
    let username = req.body.details.username;
    if (!username) {
        return res.json({error: "true", error_msg: "103"})
    }
    let last_name = req.body.details.last_name;
    if (!last_name) {
        return res.json({error: "true", error_msg: "103"})
    }
    let is_instructor = req.body.details.is_instructor;
    if (!is_instructor) {
        return res.json({error: "true", error_msg: "103"})
    }
    let city = req.body.details.city;
    let state = req.body.details.state;
    let phone_number = req.body.details.phone_number;
    let profile_pic = req.file.url;
    if (!profile_pic) {
        return res.json({error: "true", error_msg: "103"})
    }

    User.findOne({username: username}, (err1, user1) => {
        if (err1) throw err1;
        if (user1) {
            res.json({error: "true", error_msg: "102"})
        } else {

            const newUser = {
                email: email,
                password: password,
                username: username,
                first_name: first_name,
                last_name: last_name,
                city: city,
                state: state,
                phone_number: phone_number,
                is_instructor: is_instructor,
                profile_pic: profile_pic
            };
            bcrypt.hash(password, 10, (err2, hash) => {
                if (err2) throw err2;
                newUser.password = hash;
                User.create(newUser, (err3, user3) => {
                    if (err3) throw err3;
                    let newOne = {"success": "true", metadata: user3};
                    res.json(newOne);
                })
            });
        }
    })
});

router.post('/user/login', function (req, res) {
    let email = req.body.email;
    if (!email) {
        return res.json({error: "true", error_msg: "202"})
    }
    let password = req.body.password;
    if (!password) {
        return res.json({error: "true", error_msg: "202"})
    }
    User.findOne({email: email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({error: "true", error_msg: "203"});
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let newOne = {"success": "true", metadata: user};
                return res.status(200).json(newOne);
            } else {
                return res.json({error: "true", error_msg: "203"});
            }
        })
    })
});

router.post('/create-course', (req, res) => {
    let course = new Course();
    course.instructor = req.body.user_id;
    course.category = req.body.category;
    course.title = req.body.title;
    course.image = req.body.image;
    course.description = req.body.description;
    for (var i = 0; i < req.body.materials.length; i++) {
        course.materials.push(req.body.materials[i]);
    }
    course.save((err, course) => {
        res.json({success: "true", result: course});
    });

});

router.post('/add-message', (req, res) => {
    let course_id = req.body.course_id;
    let user = req.body.user_id;
    let body = req.body.body;
    let timestamp = Date.now();
    let newMessage = {
        course: course_id,
        instructor: user,
        body: body,
        timestamp: timestamp
    };
    Message.create(newMessage, (err, msg) => {
        if (err) throw err;
        res.redirect('/api/all-messages');
    })
});

router.post('/all-messages', (req, res) => {
    let course_id = req.body.course_id;
    Message.find({course: course_id}, (err, msg) => {
        if (err) throw err;
        res.json(msg);
    })
});

router.post('my-courses', (req, res) => {
    let student_id = req.body.student_id;
    User
        .find({_id: student_id})
        .populate('courses')
        .exec((err, student) => {
            if (err) throw err;
            res.json(student.courses);
        })
});

router.get('/all-courses', (req, res) => {
    Course.find({})
        .populate('students')
        .populate('instructor')
        .exec((err, courses) => {
        if (err) throw err;
        res.json(courses);
    });
});

router.post('/add-materials', upload.array('materials', 10), (req, res) => {
    let course_id = req.body.course_id;
    Course.findOne({_id: course_id}, (err, course) => {
        if (err) throw err;
        if (course) {
            for (let i = 0; i < req.files.length; i++) {
                course.materials.push(req.files[i].url);
            }
        }
        res.json({success: "true"});
    });
});

router.get('/user/:id', (req, res) => {
    let student_id = req.params.id;
    User.findOne({_id: student_id}, (err, student) => {
        if (err) throw err;
        res.json({success: "true", metadata: student});
    })
});

// dunno what wrong with it
router.post('/enroll', (req, res) => {
    let student_id = req.body.student_id;
    let course_id = req.body.course_id;
    let studentc = new StudentCourse();
    studentc.course_id = course_id;
    studentc.progress = 0;
    studentc.save((err, sc) => {
        User.findOne({_id: student_id}, (err, student) => {
            if (err) throw err;
            student.courses.push(sc._id);
            student.save();
            Course.findOne({_id: course_id}, (err, course) => {
                if (err) throw err;
                console.log(course);
                course.students.push(student_id);
                course.save();
                console.log("Pushed 2");
                res.json({success: "true"});
            })
        });
    });
});

router.get('/get-courses/:id', (req, res) => {
    let course_id = req.params.id;
    Course.findOne({_id: course_id}, (err, course) => {
        if (err) throw err;
        res.json(course);
    })
});

router.post('/rate', (req, res) => {
    let instructor = req.body.instructor;
    let student = req.body.student;
    let stars = req.body.stars;
    Rating.create({instructor: instructor, student: student, stars: stars}, (err, rating) => {
        if (err) throw err;
        res.json(rating);
    })
});

module.exports = router;
