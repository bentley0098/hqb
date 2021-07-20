const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const path = require('path');

app.use(cors())
const port = process.env.PORT || 5000;

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

//This starts the sever listening and displays message that the server running and listening on port 5000
app.listen(port, () => console.log('Listening on port 5000' ));

routes(app);
