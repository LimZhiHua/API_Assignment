// this contains services that teachers can do. Does not necessarily only affect the teachers table



const sequelize = require("./db.service")
// const db = require('./db.service');
const Teachers = require("../models/teachers_model");
const Students = require("../models/students_model");
const Teacher_student = require("../models/teacher_student_model")

const StudentService = require("./student_service")


const Sequlize = require('sequelize');

async function getTeachers(){
  const resp =  await Teachers.findAll()
  const teacher_emails = resp.map((row)=> {
    return row['teacher_email']
  })

  //console.log("resp data value is", resp[0].students)
  return teacher_emails

}

async function createTeacher(email){
  return await Teachers.findOrCreate({where: {teacher_email: email}})
}

async function registerStudent(teacher_email, student_email){

  await sequelize.transaction(async(t) => {

    await createTeacher(teacher_email)
    await StudentService.createStudent(student_email)
    
    const foundRelationship = await Teacher_student.findOne({where:{studentStudentEmail: student_email, teacherTeacherEmail: teacher_email}})
    if(foundRelationship == null){
      await Teacher_student.create({studentStudentEmail: student_email, teacherTeacherEmail: teacher_email})
    }
  });

  
}

async function commonStudents(teacherArr){
  const result = await sequelize.transaction(async(t) => {
  // Im basically joining to get all the students with the teachers, then grouping it 
    // and only taking groups which have enough teachers.
    const resp =  await Teachers.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("teacher_email")), "teacherCount"], sequelize.col("student_email")],
        includeIgnoreAttributes:false,
      include:{   
        attributes: ["student_email"],
        model: Students,
        required: true,
      },
      where: {
        teacher_email: {[Sequlize.Op.or] : teacherArr} 
      },
      group: ["student_email"],
      having:{
        teacherCount: teacherArr.length
      },
      raw : true    
    })
    const student_emails = resp.map((row)=> {
      return row['student_email']
    })
    return student_emails
  })
  return result;
 
}

async function suspendStudent (student_email){
  const exists = await StudentService.getStudent(student_email)
  if(!exists){
    const error =  new Error("Student does not exist")
    error.code = 404
    throw error;
  }
  return await Students.update({
      suspended: 1
    },
    {
      where: {student_email: student_email}
    }
  )
}

async function retreiveForNotification (teacher_email, student_list){
  const resp =  await Teachers.findAll({
    include:{
      model: Students,
      // required: true,
    },
    group: ["student_email", "teacher_email"],
    having:{
      [Sequlize.Op.or]:[
        {student_email: {[Sequlize.Op.or] : student_list}},
        {teacher_email: teacher_email}
      ],
      suspended: 0
    },
    raw : true    
  })

  let student_emails = []
  const unique_student_emails = new Set()
  for (let i = 0; i < resp.length; i++){
    if(!unique_student_emails.has(resp[i]['students.student_email'])){
      student_emails.push(resp[i]['students.student_email'])
      unique_student_emails.add(resp[i]['students.student_email'])

    }
  }

  return student_emails
}

module.exports = {
  getTeachers,
  createTeacher,
  registerStudent,
  commonStudents,
  suspendStudent,
  retreiveForNotification
}