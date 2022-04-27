const express = require('express');
var bodyParser = require('body-parser')

var mysql = require('mysql');
const util = require('util');

app = express(),
port = process.env.PORT || 3000;
app.use(bodyParser.json())


// ----------------------------------SQL Portion---------------------------------------
// Change these parameters when you get an actual DB instead of the local one.
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "new_schema",
    insecureAuth : true
  });

// I prefer async/await to callbacks.
const query = util.promisify(conn.query).bind(conn);


// ----------------------------------API Portion---------------------------------------
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

/*
    A teacher can register multiple students(new or existing). A student can also be registered to
    multiple teachers.
    Endpoint: POST /api/register
    Headers: Content-Type: application/json
    Success response status: HTTP 204
    Request body example:

    Basically adds entries to the jointeacherstudent table
*/
app.post("/api/register", async (req, res) => {
    const teacher = mysql.escape(req.body.teacher);
    const students = req.body.students;    
    // We need a list of: (teacher, student1), (teacher, student2)....
    let teachStudent = ''
    students.forEach( item => {
        teachStudent += '(' + teacher + ',' + mysql.escape(item) + '),'
    })
    if(teachStudent.length > 0){
        teachStudent = teachStudent.slice(0,-1)
    }
    const sql =  'INSERT INTO jointeacherstudent (teacher, student) values ' + teachStudent
    try {
        await query(sql);
        res.status(204).send()
    } catch (err){
        console.log(err)
        res.status(500).send(err);
    } 
});


/*
    As a teacher, I want to retrieve a list of students
    common to a given list of teachers (i.e. retrieve students
    who are registered to ALL of the given teachers).
    Endpoint: GET /api/commonstudents
    Success response status: HTTP 200
    Request example 1: GET /api/commonstudents?teacher=teacherken%40gmail.com
    Success response body 1:

    {
        "students" :
        [
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com",
        "student_only_under_teacher_ken@gmail.com"
        ]
    }

*/

app.get("/api/commonstudents", async (req, res) => {
    const teachers = req.query.teacher
    console.log("teachers is", teachers)
    let existsTeach = ''
    if(Array.isArray(teachers)){
        teachers.forEach( teacher => {
            existsTeach += existsString(teacher)
        })
        if(existsTeach.length > 0){
            existsTeach = existsTeach.slice(0,-3)
        }
    }else{
        existsTeach = existsString(teachers).slice(0,-3)
    }
    
    try {
        const sql = 'SELECT S1.student FROM students AS S1 WHERE'+ existsTeach;
        const rows = await query(sql);
        let studentList = []
        rows.forEach( item => {
            studentList.push(item.student)
        })
        res.status(200).send({'students': studentList })
    } catch (err){
        console.log(err)
        res.status(500).send(err);
    } 
   
});

const existsString = (teacher) => {
  return ' EXISTS  (SELECT * FROM jointeacherstudent AS J WHERE (S1.student = J.student AND J.teacher =' +  mysql.escape(teacher) + ')) AND'
}

/*
    As a teacher, I want to suspend a specified student.
    Endpoint: POST /api/suspend
    Headers: Content-Type: application/json
    Success response status: HTTP 204
    Request body example:
*/

app.post("/api/suspend", async (req, res) => {
    const student = req.body.student
    
    try {
        // Check if the student exists first
        const sqlCheck = 'SELECT student FROM students AS S WHERE s.student = ' + mysql.escape(student)
        const exists = (await query(sqlCheck) ).length > 0
        if(exists){
            const sql = 'UPDATE students AS S SET suspended = 1 WHERE student = ' + mysql.escape(student)
            await query(sql);
            res.status(204).send()
        }else{
            res.status(400).send({ "message": "student " + student + "was not found" })
        }       

    } catch (err){
        console.log(err)
        res.status(500).send(err);
    } 
});

/*
    As a teacher, I want to retrieve a list of students who can
    receive a given notification.

    A notification consists of:
    the teacher who is sending the notification, and
    the text of the notification itself.

    To receive notifications from e.g. 'teacherken@gmail.com', a student:
    MUST NOT be suspended,
    AND MUST fulfill AT LEAST ONE of the following:
    1. is registered with “teacherken@gmail.com"
    2. has been @mentioned in the notification
    The list of students retrieved should not contain any duplicates/repetitions.
    Endpoint: POST /api/retrievefornotifications
    Headers: Content-Type: application/json
    Success response status: HTTP 200
    Request body example 1:
    {
         "students" :
    [
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com"
    ]
    }
    {
        "student" : "studentmary@gmail.com"
    }
    {
*/
app.post("/api/retrievefornotifications", async (req, res) => {
    const teacher = mysql.escape(req.body.teacher);
    const notification = mysql.escape(req.body.notification);
    
    //const str = 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com hello there @potato@mail.ca'

    // Regex detects: @stuff@stuff 
    // Allows for multiple fullstops since some emails have that e.g zhihua.lim@mail.utoronto.ca
    const regex = /@[a-zA-Z0-9_.]+@[a-zA-Z0-9_.]+/g
    const studentList = notification.match(regex);

    let sqlStudentList = ''
    if(Array.isArray(studentList)){
        studentList.forEach( student => {
            sqlStudentList += 'S.student = ' + mysql.escape(student) + 'OR '
        })
        if(sqlStudentList.length > 0){
            sqlStudentList = sqlStudentList.slice(0,-3)
        }
    }else{
        sqlStudentList = existsString(studentList).slice(0,-3)
    }
    
    try {
        // Check if the teacher exists first
        const teacherCheck = 'SELECT teacher FROM teachers AS T WHERE T.teacher = ' + teacher
        const exists = (await query(teacherCheck) ).length > 0
        if(exists){
            const sql = 'SELECT * FROM students AS S WHERE (EXISTS (SELECT * FROM jointeacherstudent AS J WHERE (S.student = J.student AND J.teacher =' + teacher + ')) OR ' + sqlStudentList + ')AND S.suspended = 0;'
            const rows = await query(sql);
            console.log("rows is", rows)
            res.status(204).send()
        }else{
            res.status(400).send({ "message": "teacher " + teacher + "was not found" })
        }       

    } catch (err){
        console.log(err)
        res.status(500).send(err);
    } 
});

