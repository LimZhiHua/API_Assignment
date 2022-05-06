// this contains services that teachers can do. Does not necessarily only affect the teachers table



const sequelize = require("./db.service")
// const db = require('./db.service');
const Teachers = require("../models/teachers_model");
const Students = require("../models/students_model");

const StudentService = require("./student_service")

const Teacher_student = sequelize.define('teacher_student')

const Sequlize = require('sequelize');

async function getTeachers(){
  const resp =  await Teachers.findAll()
  const teacher_names = resp.map((row)=> {
    return row['teacher_name']
  })

  //console.log("resp data value is", resp[0].students)
  return teacher_names

}

async function createTeacher(name){
  return await Teachers.findOrCreate({where: {teacher_name: name}})
}


// registers a student to a teacher. If they are already registered, do nothing
// If a teacher or student does not exist, create them and then do the registering
async function registerStudent(teacher_name, student_name){
  const foundTeacher = await Teachers.findOne({where:{teacher_name: teacher_name}});
  if (!foundTeacher){
    await createTeacher(teacher_name)
  }
  const foundStudent = await Students.findOne({where:{student_name:student_name}})
  if (!foundStudent){
    await StudentService.createStudent(student_name)
  }
  const foundRelationship = await Teacher_student.findOne({where:{studentStudentName: student_name, teacherTeacherName: teacher_name}})
  if(foundRelationship == null){
    return await Teacher_student.create({studentStudentName: student_name, teacherTeacherName: teacher_name})
  }else{
    return 204
  }

}

async function commonStudents(teacherArr){

  // Im basically joining to get all the students with the teachers, then grouping it 
  // and only taking groups which have enouch teachers.
  const resp =  await Teachers.findAll({
    attributes: [[sequelize.fn("COUNT", sequelize.col("teacher_name")), "teacherCount"]],
    include:{
      model: Students,
      required: true,
    },
    where: {
      teacher_name: {[Sequlize.Op.or] : teacherArr} 
    },
    group: ["student_name"],
    having:{
      teacherCount: teacherArr.length
    },
    raw : true    
  })
  const student_names = resp.map((row)=> {
    return row['students.student_name']
  })
  //console.log("resp data value is", resp[0].students)
  return student_names
}

async function suspendStudent (student_name){
  const exists = await StudentService.getStudent(student_name)
  if(!exists){
    const error =  new Error("Student does not exist")
    error.code = 404
    throw error;
  }
  return await Students.update({
      suspended: 1
    },
    {
      where: {student_name: student_name}
    }
  )
}

async function retreiveForNotification (teacher_name, student_list){
  const resp =  await Teachers.findAll({
    include:{
      model: Students,
      // required: true,
    },
    group: ["student_name", "teacher_name"],
    having:{
      [Sequlize.Op.or]:[
        {student_name: {[Sequlize.Op.or] : student_list}},
        {teacher_name: teacher_name}
      ],
      suspended: 0
    },
    raw : true    
  })

  let student_names = []
  const unique_student_names = new Set()
  for (let i = 0; i < resp.length; i++){
    if(!unique_student_names.has(resp[i]['students.student_name'])){
      student_names.push(resp[i]['students.student_name'])
      unique_student_names.add(resp[i]['students.student_name'])

    }
  }

  return student_names
}

module.exports = {
  getTeachers,
  createTeacher,
  registerStudent,
  commonStudents,
  suspendStudent,
  retreiveForNotification
}