// this contains the controllers that teachers will use

// Controllers call the services and set the response/status code 

const service = require('../services/teacher_service');

async function getTeachers(req, res){
  try {
    const response = await service.getTeachers();
    res.json({'teachers': response});
  } catch (err) {
      console.error(`Error while getting teachers`, err.message);
      res.status(500).send({'message': err});
  }
}


// This isn't part of the required APIs. it just seems like something i would use
async function createTeacher(req, res) {
  try {
    const teacher_name = req.body.teacher;    
    const response = await service.createTeacher(teacher_name);
      console.log("response is", response)
      res.json(response);
  } catch (err) {
      console.error(`Error while creating teachers`, err.message);
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
    const teacher_name = req.body.teacher;  
    const student_names = req.body.students;
    const promises = [];  
    for(let  i =  0; i < student_names.length; i++){
      promises.push(service.registerStudent(teacher_name, student_names[i]))
    }
    Promise.allSettled(promises).then( (response) => {
      res.status(204).send();
    })
  } catch (err) {
      console.error(`Error while trying to register a student`, err.message);
      res.status(500).send({'message': err});
  }
}

async function commonStudents(req, res){
  try {
    const teacher_names = req.query.teacher;
    let teacherArr = [];
    if(!teacher_names){
      res.status(404).send({'message': "Please specify at least one teacher"});
      return;
    }else if(!Array.isArray(teacher_names)){
      teacherArr.push(teacher_names)
    }else{
      teacherArr = teacher_names
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
    const student_name = req.body.student;
    await service.suspendStudent(student_name);
    res.status(204).send();
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
  const teacher_name = req.body.teacher;
  const notification = req.body.notification;
  // Regex detects: @stuff@stuff 
  // Allows for multiple fullstops since some emails have that e.g zhihua.lim@mail.utoronto.ca
  const regex = /@[a-zA-Z0-9_.]+@[a-zA-Z0-9_.]+/g
  const studentList = notification.match(regex);
  let student_arr = []
  if (!notification || !studentList || notification.length === 0 ){
    student_arr = []
  }else if(!Array.isArray(studentList)){
    student_arr.push(studentList.slice(1))
  }else{
    studentList.forEach(student => {
      student_arr.push(student.slice(1))
    })
  }

  try {
    const resp = await service.retreiveForNotification(teacher_name, student_arr);
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
    createTeacher,
    register,
    commonStudents,
    suspendStudent,
    retrieveForNotifications
  };