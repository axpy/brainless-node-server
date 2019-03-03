const bcrypt = require('bcrypt');
const saltRounds = 10;

const hash = (password, cb) => {
  bcrypt.hash(password, saltRounds, cb);
}

const check = (password, hash, cb) => {
  bcrypt.compare(password, hash, cb)
}

module.exports = { hash, check }