const sequelize = require("./db.service")
const Students = require("../models/students_model")


async function getStudents(){
    const resp =  await Students.findAll()
    const student_names = resp.map((row)=> {
      return { "student_name" : row['student_name'] ,"suspended": row['suspended']}
    })
  
    //console.log("resp data value is", resp[0].students)
    return student_names
  
}


async function getStudent(name){
    return await Students.findOne({where:{student_name: name}})
}


async function createStudent(name){
    return Students.findOrCreate({where:{student_name: name}})
}

  
module.exports = {
    getStudents,
    getStudent,
    createStudent
}