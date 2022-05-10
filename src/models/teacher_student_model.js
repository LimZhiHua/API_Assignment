const Sequelize = require('sequelize')
const sequelize = require("../services/db.service")

const Techer_student = sequelize.define("teacher_student", {
    studentStudentEmail: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    teacherTeacherEmail: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
})

module.exports = Techer_student