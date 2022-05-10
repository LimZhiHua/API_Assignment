const Sequelize = require('sequelize')
const sequelize = require("../services/db.service")

const Teachers = sequelize.define("teachers", {
    teacher_email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    }
})



module.exports = Teachers