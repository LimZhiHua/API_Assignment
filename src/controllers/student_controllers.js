// this contains the controllers that teachers will use

// Controllers call the services and set the response/status code 

const service = require('../services/student_service');

async function createStudent(req, res) {
  try {
    const student_name = req.body.student;    
    const response = await service.createStudent(student_name);
      console.log("response is", response)
      res.json(response);
  } catch (err) {
      console.error(`Error while treying to create a student`, err.message);
      res.status(500).send({'message': err});
    }
}

module.exports = {
    createStudent
};