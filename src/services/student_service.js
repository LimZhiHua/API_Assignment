const sequelize = require("./db.service")
const Students = require("../models/students_model")


async function getStudent(name){
    return await Students.findOne({where:{student_name: name}})
}


async function createStudent(name){
    return Students.findOrCreate({where:{student_name: name}})
}

  
module.exports = {
    getStudent,
    createStudent
}