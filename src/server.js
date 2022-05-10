const express = require('express');
const startDB = require("./models/index")
var bodyParser = require('body-parser')

const app = express();
const port =  3000;
const routes = require('./routes/routes.js');



 startDB().then(()=>{
  app.emit('Sequelize synced');

})

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.use('/api/', routes);

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