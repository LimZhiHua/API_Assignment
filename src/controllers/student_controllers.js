// this contains the controllers that teachers will use

// Controllers call the services and set the response/status code 

const service = require('../services/student_service');


async function getStudents(req, res){
  try {
    const response = await service.getStudents();
      res.json({'students' :response});
  } catch (err) {
      console.error(`Error while getting programming languages`, err.message);
      res.status(500).send({'message': err});
  }
}


module.exports = {
    getStudents,
};