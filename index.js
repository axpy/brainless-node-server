const express = require('express');
const app = express();
const port = 3000;
const db = require('./db.js')(`${__dirname}/db.json`);
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/users', (req, res) => res.send(db.get('users')));
app.post('/users', (req, res) => {
  const user = {id: db.generateId(), ...req.body};
  db.post('users', user);
  res.send(user);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))