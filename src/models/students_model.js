const Sequelize = require('sequelize')
const sequelize = require("../services/db.service")

const Students = sequelize.define("students", {
    student_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    suspended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
})

module.exports = Students