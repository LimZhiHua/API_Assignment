// this should just call the controller. 
// this helps decide the route path name

const express = require('express');
const router = express.Router();
const teacher_controller = require('../controllers/teacher_controllers');
const student_controller = require('../controllers/student_controllers');

// these two are used for testing
router.get('/getTeachers', teacher_controller.getTeachers);
router.get('/getStudents', student_controller.getStudents);


router.post('/register', teacher_controller.register);

router.get('/commonstudents', teacher_controller.commonStudents);

router.post('/suspend', teacher_controller.suspendStudent);

router.post('/retrievefornotifications', teacher_controller.retrieveForNotifications)

module.exports = router;