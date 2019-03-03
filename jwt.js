const jwt = require('jsonwebtoken');
const secret = 'mysterioussecret';

const sign = (data, cb) => {
  jwt.sign(
    { data },
    secret, 
    { expiresIn: '1h' },
    cb
  );
}

const verify = (data, cb) => {
  jwt.verify(data, secret, cb); 
}

module.exports = { sign, verify };