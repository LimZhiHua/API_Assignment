const sequelize = require("./src/services/db.service")
const Students = require('./src/models/students_model')
const Teachers = require("./src/models/teachers_model")

const express = require('express');
var bodyParser = require('body-parser')

const app = express();
const port =  3000;
const routes = require('./src/routes/routes.js');


sequelize.sync()
.then((result)=>{
    console.log("Sequelize synced");
}).catch((err)=>{
    console.log("error is", err)
});

Students.belongsToMany(Teachers, {through: 'teacher_student'})
Teachers.belongsToMany(Students, {through: 'teacher_student'})


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/api', routes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`)
});

module.exports = app