const service = require("../services/student_service");

async function getStudents(req, res) {
  try {
    const response = await service.getStudents();
    res.json({ students: response });
  } catch (err) {
    console.error(`Error while getting student controller`, err.message);
    res.status(500).send({ message: err });
  }
}

module.exports = {
  getStudents,
};
