const sequelize = require("../services/db.service")
const Students = require('./students_model')
const Teachers = require("./teachers_model")
const Teacher_student = require("./teacher_student_model")

const express = require('express');

const app = express();

const startDB = async () => {
    await sequelize.sync({force: true})
    
    Students.belongsToMany(Teachers, {through: Teacher_student})
    Teachers.belongsToMany(Students, {through: Teacher_student})
    
}

module.exports = startDB