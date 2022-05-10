const Students = require("../models/students_model")


async function getStudents(){
    const resp =  await Students.findAll()
    const student_emails = resp.map((row)=> {
      return { "student_email" : row['student_email'] ,"suspended": row['suspended']}
    })
  
    return student_emails
  
}


async function getStudent(email){
    return await Students.findOne({where:{student_email: email}})
}


async function createStudent(email, trans){
    return Students.findOrCreate({where:{student_email: email}, transaction: trans})
}

  
module.exports = {
    getStudents,
    getStudent,
    createStudent
}