// this contains the controllers that teachers will use

// Controllers call the services and set the response/status code 

const service = require('../services/teacher_service');
const utils = require("../utilities/utils")

// for testing
async function getTeachers(req, res){
  try {
    const response = await service.getTeachers();
    res.json({'teachers': response});
  } catch (err) {
      console.error(`Error while getting teachers`, err.message);
      res.status(500).send({'message': err});
  }
}


/*
    A teacher can register multiple students(new or existing). A student can also be registered to
    multiple teachers.
    Endpoint: POST /api/register
    Headers: Content-Type: application/json
    Success response status: HTTP 204
    Request body example:
    {
        "teacher": "teacherken@gmail.com",
        "students":
        [
            "studentjon@gmail.com",
            "studenthon@gmail.com"
        ]
    }


    Basically adds entries to the jointeacherstudent table
*/
async function register(req, res){
  try {

    // check to make sure they emails are proper emails.
    // make sure they pass in something for the teacher/students

    const teacher_email = req.body.teacher;  
    const student_emails = req.body.students;

    if (!teacher_email || !student_emails){
      return res.status(400).send({'message': "Please specify a teacher and list of students"});
    }

    if (!utils.emailCheck(teacher_email)){
      return res.status(400).send({'message': "Please ensure the teacher has a valid email"})
    }

    if( !utils.arrEmailCheck(student_emails)){
      return res.status(400).send({'message': "Please ensure that all students have a valid email"})
    }

    await service.registerStudents(teacher_email, student_emails)
   
    res.sendStatus(204)

  } catch (err) {
      console.error(`Error while trying to register a student`, err.message);
      res.status(500).send({'message': err});
  }
}

async function commonStudents(req, res){
  try {
    const teacher_emails = req.query.teacher;
    let teacherArr = [];
    if(!teacher_emails){
      return res.status(400).send({'message': "Please specify at least one teacher"});
    }
    
    if(!Array.isArray(teacher_emails)){
      teacherArr.push(teacher_emails)
    }else{
      teacherArr = teacher_emails
    }
  
    const response = await service.commonStudents(teacherArr);
    res.status(200).send({'students': response});
  } catch (err) {
      console.error(`Error while trying to find students`, err.message);
      res.status(500).send({'message': err});
  }
}

async function suspendStudent(req, res){
  try {
    
    const student_email = req.body.student;

    if(!student_email){
      return res.status(404).send({'message': 'Please specify a student'})
    }

    await service.suspendStudent(student_email);
    res.sendStatus(204)
  } catch (err) {
      if (err.code === 404){
        res.status(404).send({'message': 'Student does not exist'});
      }else{
        console.error(`Error while trying to suspend a student`, err.message);
        res.status(500).send({'message': err});
      }
  }
}

async function retrieveForNotifications (req, res){
  const teacher_email = req.body.teacher;
  const notification = req.body.notification;


  if(!notification || notification.length === 0){
      return res.status(400).send({'message': 'Please provide a notification'});
  }

  if(!teacher_email || teacher_email.length === 0){
    return res.status(400).send({'message': 'Please provide a teacher'});
  }

  const studentList = await utils.notifEmailCheck(notification)
  let student_arr = []
  if (!notification || !studentList || notification.length === 0 ){
    student_arr = []
  }else if(!Array.isArray(studentList)){
    student_arr.push(studentList.slice(1))
  }else{
    studentList.forEach(student => {
      console.log("student is", student)
      student_arr.push(student.slice(1))
    })
  }

  try {
    const resp = await service.retreiveForNotification(teacher_email, student_arr);
    res.status(200).send({"recipients" :resp});
  } catch (err) {
      if (err.code === 404){
        res.status(404).send({'message': 'Student does not exist'});
      }else{
        console.error(`Error while trying to retrieve notifications`, err.message);
        res.status(500).send({'message': err});
      }
  }



}

  module.exports = {
    getTeachers,
    register,
    commonStudents,
    suspendStudent,
    retrieveForNotifications
  };