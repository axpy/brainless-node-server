const fs = require('fs');

function createDb(dbPath) {
  let db = JSON.parse(fs.readFileSync(dbPath));
  return {
    refresh(newDb = db) {
      fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2));
      db = JSON.parse(fs.readFileSync(dbPath));
    },
    generateId() {
      return (Math.random() * 10e16).toString(32) + (Math.random() * 10e16).toString(32); 
    },
    get(prop) {
      return db[prop];
    },
    post(prop, value, refresh = true) {
      db[prop].push(value);
      refresh && this.refresh();
    },
    find(prop, valueProp, value) {
      return db[prop].find(i => i[valueProp] == value);
    },
    doesExist(prop, valueProp, value) {
      return !!db[prop].find(i => i[valueProp] == value);
    }
  }
}

module.exports = createDb;