const express = require('express');
const app = express();
const port = 3000;
const db = require('./db.js')(`${__dirname}/db.json`);
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { sendError } = require('./helpers');
const { hash, check } = require('./crypt');
const { sign, verify } = require('./jwt');

const protectedRoutes = ['/orders', '/protected'];

app.use((req, res, next) => {
  if (protectedRoutes.includes(req.path)) {
    verify(req.headers.authorization, (err, isValid) => {
      if (err || !isValid) {
        return sendError(res, 401, 'Not authorized!')
      } else {
        return next();
      }
    }) 
  } else {
    return next();
  }
})

app.post('/auth/signin', (req, res) => {
  const { email, password } = req.body;
  const user = db.find('users', 'email', email);

  if (!user) {
    return sendError(res, 401, 'Wrong credentials');
  }

  check(password, user.password, (err, isValid) => {
    if (err || !isValid) {
      console.error(err);
      return sendError(res, 401, 'Wrong credentials');
    } else {
      sign(email + user.password, (err, token) => {
        if (err) {
          return sendError(res);
        } else {
          return res.send({token, message: 'Success!'});    
        }
      })
    }
  })
})

app.post('/auth/signup', (req, res) => {
  const user = req.body;

  if (db.doesExist('users', 'email', user.email)) {
    return sendError(res);
  }

  hash(user.password, (err, hash) => {
    if (err) {
      console.error(err);
      return sendError(res);
    } else {
      user.password = hash;
      user.id = db.generateId();
      db.post('users', user);
      return res.send(user);    
    }
  })
})

app.get('/protected', (req, res) => {
  verify(req.headers.authorization, (err, isValid) => {
    if (err || !isValid) {
      return sendError(res, 401, 'Not authorized!')
    } else {
      return res.send({yo: 'Yo!'});
    }
  })
})

app.get('/orders', (req, res) => {
  res.send(db.get('orders'));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
